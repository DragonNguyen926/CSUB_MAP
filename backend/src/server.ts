import "dotenv/config"
import express from "express"
import cors from "cors"
import { z } from "zod"
import { prisma } from "./prisma"
import cron from "node-cron"
const app = express()
app.use(cors())
app.use(express.json())
app.get("/debug/db", async (_req, res) => {
  const buildingCount = await prisma.building.count()
  const eventCount = await prisma.event.count()
  res.json({ buildingCount, eventCount })
})

app.get("/debug/events", async (_req, res) => {
  const items = await prisma.event.findMany({
    orderBy: { startAt: "asc" },
    take: 20,
  })
  res.json({ items })
})
app.get("/health", (_req, res) => res.json({ ok: true }))

app.get("/api/buildings/search", async (req, res) => {
  const parsed = z
    .object({
      q: z.string().trim().min(1),
      limit: z
        .string()
        .optional()
        .transform((v) => {
          const n = v ? Number(v) : 12
          return Number.isFinite(n) ? Math.max(1, Math.min(30, n)) : 12
        }),
    })
    .safeParse({ q: req.query.q, limit: req.query.limit })

  if (!parsed.success) return res.status(400).json({ error: "Invalid query" })

  const { q, limit } = parsed.data
  const qLower = q.toLowerCase()

  const rows = await prisma.building.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        // aliases exact match (we stored lower-ish)
        { aliases: { has: qLower } },
      ],
    },
    take: 50,
  })

  const items = rows
    .map((b) => {
      const name = b.name.toLowerCase()
      const starts = name.startsWith(qLower)
      const contains = name.includes(qLower)
      const aliasHit = b.aliases.some((a) => a.toLowerCase().includes(qLower))

      let score = 0
      if (starts) score += 5
      if (contains) score += 3
      if (aliasHit) score += 4
      if (name.includes("csub")) score += 1

      return { b, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ b, score }) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      center: { lat: b.centerLat, lng: b.centerLng },
      campus: b.campus,
      score,
    }))

  res.json({ items })
})

app.post("/api/events", async (req, res) => {
  const parsed = z
    .object({
      title: z.string().trim().min(1),
      organization: z.string().trim().min(1),
      buildingId: z.string().trim().min(1),
      roomNote: z.string().trim().optional().default(""),
      startAt: z.string().trim().min(1),
      endAt: z.string().trim().min(1),
    })
    .safeParse(req.body)

  if (!parsed.success) return res.status(400).json({ error: "Invalid body" })

  const { title, organization, buildingId, roomNote, startAt, endAt } = parsed.data

  const start = new Date(startAt)
  const end = new Date(endAt)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ error: "startAt/endAt must be ISO datetime strings" })
  }
  if (end <= start) {
    return res.status(400).json({ error: "endAt must be after startAt" })
  }

  const building = await prisma.building.findUnique({
    where: { id: buildingId },
    select: { id: true, name: true },
  })
  if (!building) return res.status(400).json({ error: "buildingId not found" })

  const conflict = await prisma.event.findFirst({
    where: {
      buildingId,
      startAt: { lt: end },
      endAt: { gt: start },
    },
    orderBy: { startAt: "asc" },
    select: { id: true, title: true, startAt: true, endAt: true, buildingId: true },
  })

  if (conflict) {
    return res.status(409).json({
      error: "Schedule conflict: another event exists in this building during that time.",
      conflict,
    })
  }

  const created = await prisma.event.create({
    data: {
      title,
      organization,
      buildingId,
      roomNote,
      startAt: start,
      endAt: end,
    },
    select: {
      id: true,
      title: true,
      organization: true,
      buildingId: true,
      roomNote: true,
      startAt: true,
      endAt: true,
      createdAt: true,
    },
  })

  return res.status(201).json({ item: created })
})
app.get("/api/events", async (req, res) => {
  const parsed = z
    .object({
      from: z.string().trim().min(1), // YYYY-MM-DD
      to: z.string().trim().min(1),   // YYYY-MM-DD
    })
    .safeParse({ from: req.query.from, to: req.query.to })

  if (!parsed.success) return res.status(400).json({ error: "Invalid query" })

  const { from, to } = parsed.data

  // interpret as local dates; send UTC boundaries (good enough for now)
  const fromDate = new Date(`${from}T00:00:00.000Z`)
  const toDate = new Date(`${to}T23:59:59.999Z`)

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return res.status(400).json({ error: "Invalid date format" })
  }

  try {
    const items = await prisma.event.findMany({
      where: {
        startAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: { startAt: "asc" },
      select: {
        id: true,
        title: true,
        organization: true,
        startAt: true,
        endAt: true,
        roomNote: true,
        buildingId: true,
        building: {
          select: {
            id: true,
            name: true,
            slug: true,
            centerLat: true,
            centerLng: true,
          },
        },
      },
    })

    res.json({ items })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Failed to load events" })
  }
})
const port = Number(process.env.PORT ?? 3001)
async function cleanupPastEvents() {
  const now = new Date()
  const result = await prisma.event.deleteMany({
    where: { endAt: { lt: now } },
  })
  if (result.count > 0) {
    console.log(`[cleanup] deleted past events: ${result.count}`)
  } else {
    console.log("[cleanup] no past events to delete")
  }
}
// run once at startup (optional but helpful)
cleanupPastEvents().catch(console.error)

// Every day at 00:10 local server time
cron.schedule(
  "10 0 * * *",
  () => cleanupPastEvents().catch(console.error),
  { timezone: "America/Los_Angeles" }
)
app.listen(port, () => console.log(`API running on http://localhost:${port}`))