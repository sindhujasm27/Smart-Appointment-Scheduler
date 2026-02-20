import { NextResponse } from "next/server"
import { db, initializeDb, generateId } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

// GET /api/appointments
export async function GET(request: Request) {
  try {
    await initializeDb()

    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Admin sees all, user sees their own
    if (user.role === "admin") {
      return NextResponse.json({ appointments: db.appointments })
    }

    const userAppointments = db.appointments.filter(
      (a) => a.userId === user.userId
    )
    return NextResponse.json({ appointments: userAppointments })
  } catch (err) {
    console.error("Fetch appointments error:", err)
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    )
  }
}

// POST /api/appointments - Book
export async function POST(request: Request) {
  try {
    await initializeDb()

    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { slotId } = body

    if (!slotId) {
      return NextResponse.json(
        { error: "Slot ID is required" },
        { status: 400 }
      )
    }

    const slot = db.slots.find((s) => s.id === slotId)
    if (!slot) {
      return NextResponse.json(
        { error: "Slot not found" },
        { status: 404 }
      )
    }

    if (!slot.isAvailable) {
      return NextResponse.json(
        { error: "This slot is no longer available" },
        { status: 400 }
      )
    }

    // Mark slot as unavailable
    slot.isAvailable = false

    const appointment = {
      id: generateId("appt"),
      userId: user.userId,
      userName: user.name,
      slotId: slot.id,
      slot: { ...slot },
      status: "booked" as const,
      createdAt: new Date().toISOString(),
    }

    db.appointments.push(appointment)

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (err) {
    console.error("Book appointment error:", err)
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    )
  }
}
