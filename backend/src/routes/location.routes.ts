import express, { Response } from "express"
import { z } from "zod"
import { prisma } from "../prisma"
import { requireAuth, AuthenticatedRequest } from "../middleware/auth"

const router = express.Router()

router.post("/update", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = z
      .object({
        latitude: z.coerce.number().min(-90).max(90),
        longitude: z.coerce.number().min(-180).max(180),
      })
      .safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid latitude or longitude" })
    }

    if (!req.auth) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const userId = req.auth.userId
    const { latitude, longitude } = parsed.data

    const item = await prisma.userLocation.upsert({
      where: { userId },
      update: { latitude, longitude },
      create: { userId, latitude, longitude },
      select: {
        userId: true,
        latitude: true,
        longitude: true,
        updatedAt: true,
      },
    })

    return res.json({ item })
  } catch (error) {
    console.error("POST /location/update error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})
router.post("/share/all-off", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.auth) {
        return res.status(401).json({ error: "Unauthorized" })
      }
  
      const ownerId = req.auth.userId
  
      await prisma.locationShare.updateMany({
        where: {
          ownerId,
          isEnabled: true,
        },
        data: {
          isEnabled: false,
        },
      })
  
      return res.json({ ok: true })
    } catch (error) {
      console.error("POST /location/share/all-off error:", error)
      return res.status(500).json({ error: "Internal server error" })
    }
  })
router.post("/share/:friendId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const ownerId = req.auth.userId
    const friendId = String(req.params.friendId)

    if (!friendId) {
      return res.status(400).json({ error: "friendId is required" })
    }

    if (ownerId === friendId) {
      return res.status(400).json({ error: "Cannot share with yourself" })
    }

    const friendship = await prisma.friendship.findFirst({
      where: {
        status: "accepted",
        OR: [
          { requesterId: ownerId, addresseeId: friendId },
          { requesterId: friendId, addresseeId: ownerId },
        ],
      },
      select: { id: true },
    })

    if (!friendship) {
      return res.status(403).json({
        error: "You can only share location with accepted friends",
      })
    }

    const item = await prisma.locationShare.upsert({
      where: {
        ownerId_viewerId: {
          ownerId,
          viewerId: friendId,
        },
      },
      update: {
        isEnabled: true,
      },
      create: {
        ownerId,
        viewerId: friendId,
        isEnabled: true,
      },
      select: {
        id: true,
        ownerId: true,
        viewerId: true,
        isEnabled: true,
        updatedAt: true,
      },
    })

    return res.json({ item })
  } catch (error) {
    console.error("POST /location/share error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

router.delete("/share/:friendId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const ownerId = req.auth.userId
    const friendId = String(req.params.friendId)

    const existing = await prisma.locationShare.findUnique({
      where: {
        ownerId_viewerId: {
          ownerId,
          viewerId: friendId,
        },
      },
    })

    if (!existing) {
      return res.status(404).json({ error: "Share setting not found" })
    }

    await prisma.locationShare.update({
      where: {
        ownerId_viewerId: {
          ownerId,
          viewerId: friendId,
        },
      },
      data: {
        isEnabled: false,
      },
    })

    return res.json({ ok: true })
  } catch (error) {
    console.error("DELETE /location/share error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/friends", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const viewerId = req.auth.userId

    const rows = await prisma.locationShare.findMany({
      where: {
        viewerId,
        isEnabled: true,
      },
      select: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            location: {
              select: {
                latitude: true,
                longitude: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    })

    const items = rows
      .filter((row) => row.owner.location)
      .map((row) => ({
        id: row.owner.id,
        firstName: row.owner.firstName,
        lastName: row.owner.lastName,
        email: row.owner.email,
        latitude: row.owner.location!.latitude,
        longitude: row.owner.location!.longitude,
        updatedAt: row.owner.location!.updatedAt,
      }))

    return res.json({ items })
  } catch (error) {
    console.error("GET /location/friends error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})
router.get("/map", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.auth) {
        return res.status(401).json({ error: "Unauthorized" })
      }
  
      const viewerId = req.auth.userId
  
      const rows = await prisma.locationShare.findMany({
        where: {
          viewerId,
          isEnabled: true,
        },
        select: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              location: {
                select: {
                  latitude: true,
                  longitude: true,
                  updatedAt: true,
                },
              },
              locationViewPrefsTarget: {
                where: {
                  viewerId,
                },
                select: {
                  isHidden: true,
                  isPinned: true,
                },
              },
            },
          },
        },
      })
  
      const items = rows
        .filter((row) => row.owner.location)
        .map((row) => {
          const pref = row.owner.locationViewPrefsTarget[0]
  
          return {
            id: row.owner.id,
            firstName: row.owner.firstName,
            lastName: row.owner.lastName,
            email: row.owner.email,
            latitude: row.owner.location!.latitude,
            longitude: row.owner.location!.longitude,
            updatedAt: row.owner.location!.updatedAt,
            isHidden: pref?.isHidden ?? false,
            isPinned: pref?.isPinned ?? false,
          }
        })
  
      return res.json({ items })
    } catch (error) {
      console.error("GET /location/map error:", error)
      return res.status(500).json({ error: "Internal server error" })
    }
  })
  
  router.get("/sharing", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.auth) {
        return res.status(401).json({ error: "Unauthorized" })
      }
  
      const ownerId = req.auth.userId
  
      const rows = await prisma.friendship.findMany({
        where: {
          status: "accepted",
          OR: [
            { requesterId: ownerId },
            { addresseeId: ownerId },
          ],
        },
        select: {
          requesterId: true,
          addresseeId: true,
        },
      })
  
      const friendIds = rows.map((row) =>
        row.requesterId === ownerId ? row.addresseeId : row.requesterId
      )
  
      const shares = await prisma.locationShare.findMany({
        where: {
          ownerId,
          viewerId: { in: friendIds },
        },
        select: {
          viewerId: true,
          isEnabled: true,
        },
      })
  
      const shareMap = new Map(shares.map((s) => [s.viewerId, s.isEnabled]))
  
      const items = friendIds.map((friendId) => ({
        friendId,
        isSharing: shareMap.get(friendId) ?? false,
      }))
  
      return res.json({ items })
    } catch (error) {
      console.error("GET /location/sharing error:", error)
      return res.status(500).json({ error: "Internal server error" })
    }
  })

export default router