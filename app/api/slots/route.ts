import { NextResponse } from "next/server"
import { db, initializeDb, generateId } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

// GET /api/slots - Fetch available slots
export async function GET(request: Request) {
  try {
    await initializeDb()

    const user = getUserFromRequest(request)
    const url = new URL(request.url)
    const showAll = url.searchParams.get("all") === "true"

    // Admin can see all slots, users only see available
    if (showAll && user?.role === "admin") {
      return NextResponse.json({ slots: db.slots })
    }

    const availableSlots = db.slots.filter((s) => s.isAvailable)
    return NextResponse.json({ slots: availableSlots })
  } catch (err) {
    console.error("Fetch slots error:", err)
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    )
  }
}

// POST /api/slots - Create a new slot (admin only)
export async function POST(request: Request) {
  try {
    await initializeDb()

    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { startTime, endTime } = body

    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: "Start time and end time are required" },
        { status: 400 }
      )
    }

    const newSlot = {
      id: generateId("slot"),
      providerId: user.userId,
      providerName: user.name,
      startTime,
      endTime,
      isAvailable: true,
    }

    db.slots.push(newSlot)

    return NextResponse.json({ slot: newSlot }, { status: 201 })
  } catch (err) {
    console.error("Create slot error:", err)
    return NextResponse.json(
      { error: "Failed to create slot" },
      { status: 500 }
    )
  }
}
