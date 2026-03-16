import { Router } from "express"
import { prisma } from "../prisma"

export const buildingsRouter = Router()

// GET /api/buildings?q=lib
buildingsRouter.get("/", async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : ""

  try {
    if (!q) {
      const buildings = await prisma.building.findMany({
        orderBy: { name: "asc" },
        take: 200,
        select: {
          id: true,
          slug: true,
          name: true,
          aliases: true,
          campus: true,
          centerLat: true,
          centerLng: true,
        },
      })
      return res.json(buildings)
    }

    const buildings = await prisma.building.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          // aliases là String[] nên dùng hasSome/has
          { aliases: { has: q } },
        ],
      },
      orderBy: { name: "asc" },
      take: 20,
      select: {
        id: true,
        slug: true,
        name: true,
        aliases: true,
        campus: true,
        centerLat: true,
        centerLng: true,
      },
    })

    return res.json(buildings)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Failed to load buildings" })
  }
})