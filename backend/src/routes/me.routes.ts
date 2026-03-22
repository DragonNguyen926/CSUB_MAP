import { Router } from "express"
import { prisma } from "../prisma"
import { AuthenticatedRequest, requireAuth } from "../middleware/auth"

const router = Router()

router.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.auth?.userId

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    return res.json({ user })
  } catch (error) {
    console.error("GET /auth/me error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

router.patch("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.auth?.userId
    const { firstName, lastName } = req.body ?? {}

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (typeof firstName !== "string" || typeof lastName !== "string") {
      return res.status(400).json({
        error: "firstName and lastName are required",
      })
    }

    const cleanFirstName = firstName.trim()
    const cleanLastName = lastName.trim()

    if (!cleanFirstName || !cleanLastName) {
      return res.status(400).json({
        error: "All fields must be non-empty",
      })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: cleanFirstName,
        lastName: cleanLastName,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("PATCH /auth/me error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router