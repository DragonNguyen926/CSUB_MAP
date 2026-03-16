import { Router } from "express"
import { prisma } from "../prisma"

export const eventsRouter = Router()

function isNonEmptyString(v: any) {
  return typeof v === "string" && v.trim().length > 0
}

function parseISO(v: any): Date | null {
  if (typeof v !== "string") return null
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return null
  return d
}

// POST /api/events
eventsRouter.post("/", async (req, res) => {
  const { title, organization, buildingId, roomNote, startAt, endAt } = req.body ?? {}
    
  if (!isNonEmptyString(title)) return res.status(400).json({ message: "title is required" })
  if (!isNonEmptyString(organization)) return res.status(400).json({ message: "organization is required" })
  if (!isNonEmptyString(buildingId)) return res.status(400).json({ message: "buildingId is required" })

  const start = parseISO(startAt)
  const end = parseISO(endAt)
  if (!start) return res.status(400).json({ message: "startAt must be an ISO datetime string" })
  if (!end) return res.status(400).json({ message: "endAt must be an ISO datetime string" })
  if (end <= start) return res.status(400).json({ message: "endAt must be after startAt" })

  const note = typeof roomNote === "string" ? roomNote.trim() : ""

  try {
    // đảm bảo building tồn tại
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
      select: { id: true, name: true },
    })
    if (!building) return res.status(400).json({ message: "buildingId not found" })

    // ✅ COLLISION CHECK (A chặt): cùng building + overlap time
    const conflict = await prisma.event.findFirst({
      where: {
        buildingId,
        startAt: { lt: end }, // existing.start < new.end
        endAt: { gt: start }, // existing.end > new.start
      },
      orderBy: { startAt: "asc" },
      select: {
        id: true,
        title: true,
        organization: true,
        startAt: true,
        endAt: true,
        buildingId: true,
      },
    })

    if (conflict) {
      return res.status(409).json({
        message: "Schedule conflict: another event exists in this building during that time.",
        conflict,
      })
    }

    const created = await prisma.event.create({
      data: {
        title: title.trim(),
        organization: organization.trim(),
        buildingId,
        roomNote: note,
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
    const now = new Date()
if (start <= now) {
  return res.status(400).json({ error: "Events must be created in the future." })
}
    return res.status(201).json(created)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Failed to create event" })
  }
})

