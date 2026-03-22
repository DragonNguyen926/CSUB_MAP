import { Router } from "express"
import { prisma } from "../prisma"
import { requireAuth, AuthenticatedRequest } from "../middleware/auth"

const router = Router()

const userPreviewSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
}

router.post("/request", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const currentUserId = req.auth?.userId
    const { email, targetUserId } = req.body as {
      email?: string
      targetUserId?: string
    }

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!email && !targetUserId) {
      return res.status(400).json({ error: "Provide email or targetUserId" })
    }

    let targetUser: {
      id: string
      firstName: string
      lastName: string
      email: string
    } | null = null

    if (targetUserId) {
      targetUser = await prisma.user.findUnique({
        where: { id: String(targetUserId) },
        select: userPreviewSelect,
      })
    } else if (email) {
      const normalizedEmail = email.trim().toLowerCase()

      targetUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: userPreviewSelect,
      })
    }

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" })
    }

    if (targetUser.id === currentUserId) {
      return res.status(400).json({
        error: "You cannot send a friend request to yourself",
      })
    }

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: currentUserId, addresseeId: targetUser.id },
          { requesterId: targetUser.id, addresseeId: currentUserId },
        ],
      },
      include: {
        requester: { select: userPreviewSelect },
        addressee: { select: userPreviewSelect },
      },
    })

    if (existing) {
      if (existing.status === "accepted") {
        return res.status(409).json({ error: "Already friends" })
      }

      if (existing.status === "pending") {
        if (existing.requesterId === currentUserId) {
          return res.status(409).json({ error: "Friend request already sent" })
        }

        return res.status(409).json({
          error: "This user already sent you a friend request",
        })
      }

      if (existing.status === "blocked") {
        return res.status(403).json({ error: "Friend request unavailable" })
      }

      if (existing.status === "rejected") {
        const revived = await prisma.friendship.update({
          where: { id: existing.id },
          data: {
            requesterId: currentUserId,
            addresseeId: targetUser.id,
            status: "pending",
          },
          include: {
            requester: { select: userPreviewSelect },
            addressee: { select: userPreviewSelect },
          },
        })

        return res.status(200).json({
          message: "Friend request sent",
          friendship: revived,
        })
      }
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId: currentUserId,
        addresseeId: targetUser.id,
        status: "pending",
      },
      include: {
        requester: { select: userPreviewSelect },
        addressee: { select: userPreviewSelect },
      },
    })

    return res.status(201).json({
      message: "Friend request sent",
      friendship,
    })
  } catch (error) {
    console.error("POST /friends/request error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/requests/incoming", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const currentUserId = req.auth?.userId

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const requests = await prisma.friendship.findMany({
      where: {
        addresseeId: currentUserId,
        status: "pending",
      },
      include: {
        requester: { select: userPreviewSelect },
        addressee: { select: userPreviewSelect },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return res.json({ requests })
  } catch (error) {
    console.error("GET /friends/requests/incoming error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/requests/outgoing", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const currentUserId = req.auth?.userId

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const requests = await prisma.friendship.findMany({
      where: {
        requesterId: currentUserId,
        status: "pending",
      },
      include: {
        requester: { select: userPreviewSelect },
        addressee: { select: userPreviewSelect },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return res.json({ requests })
  } catch (error) {
    console.error("GET /friends/requests/outgoing error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/requests/:id/accept", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const currentUserId = req.auth?.userId
    const requestId = String(req.params.id || "")

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!requestId) {
      return res.status(400).json({ error: "Missing request id" })
    }

    const existing = await prisma.friendship.findUnique({
      where: { id: requestId },
      include: {
        requester: { select: userPreviewSelect },
        addressee: { select: userPreviewSelect },
      },
    })

    if (!existing) {
      return res.status(404).json({ error: "Friend request not found" })
    }

    if (existing.addresseeId !== currentUserId) {
      return res.status(403).json({ error: "Forbidden" })
    }

    if (existing.status !== "pending") {
      return res.status(409).json({
        error: `Cannot accept a ${existing.status} request`,
      })
    }

    const updated = await prisma.friendship.update({
      where: { id: requestId },
      data: {
        status: "accepted",
      },
      include: {
        requester: { select: userPreviewSelect },
        addressee: { select: userPreviewSelect },
      },
    })

    return res.json({
      message: "Friend request accepted",
      friendship: updated,
    })
  } catch (error) {
    console.error("POST /friends/requests/:id/accept error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/requests/:id/reject", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const currentUserId = req.auth?.userId
    const requestId = String(req.params.id || "")

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!requestId) {
      return res.status(400).json({ error: "Missing request id" })
    }

    const existing = await prisma.friendship.findUnique({
      where: { id: requestId },
      include: {
        requester: { select: userPreviewSelect },
        addressee: { select: userPreviewSelect },
      },
    })

    if (!existing) {
      return res.status(404).json({ error: "Friend request not found" })
    }

    if (existing.addresseeId !== currentUserId) {
      return res.status(403).json({ error: "Forbidden" })
    }

    if (existing.status !== "pending") {
      return res.status(409).json({
        error: `Cannot reject a ${existing.status} request`,
      })
    }

    const updated = await prisma.friendship.update({
      where: { id: requestId },
      data: {
        status: "rejected",
      },
      include: {
        requester: { select: userPreviewSelect },
        addressee: { select: userPreviewSelect },
      },
    })

    return res.json({
      message: "Friend request rejected",
      friendship: updated,
    })
  } catch (error) {
    console.error("POST /friends/requests/:id/reject error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const currentUserId = req.auth?.userId

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const rows = await prisma.friendship.findMany({
      where: {
        status: "accepted",
        OR: [{ requesterId: currentUserId }, { addresseeId: currentUserId }],
      },
      include: {
        requester: { select: userPreviewSelect },
        addressee: { select: userPreviewSelect },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    const friends = rows.map((row) => {
      const friend = row.requesterId === currentUserId ? row.addressee : row.requester

      return {
        friendshipId: row.id,
        friend,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }
    })

    return res.json({ friends })
  } catch (error) {
    console.error("GET /friends error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const currentUserId = req.auth?.userId
    const friendshipId = String(req.params.id || "")

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!friendshipId) {
      return res.status(400).json({ error: "Missing friendship id" })
    }

    const existing = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    })

    if (!existing) {
      return res.status(404).json({ error: "Friendship not found" })
    }

    const belongsToUser =
      existing.requesterId === currentUserId || existing.addresseeId === currentUserId

    if (!belongsToUser) {
      return res.status(403).json({ error: "Forbidden" })
    }

    if (existing.status !== "accepted") {
      return res.status(409).json({
        error: "Only accepted friendships can be removed",
      })
    }

    await prisma.friendship.delete({
      where: { id: friendshipId },
    })

    return res.json({
      message: "Friend removed successfully",
    })
  } catch (error) {
    console.error("DELETE /friends/:id error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router