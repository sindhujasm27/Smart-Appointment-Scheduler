import { NextResponse } from "next/server"
import { db, initializeDb } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

// PUT /api/appointments/:id - Reschedule
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDb()

    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const body = await request.json()
    const { newSlotId } = body

    if (!newSlotId) {
      return NextResponse.json(
        { error: "New slot ID is required" },
        { status: 400 }
      )
    }

    const appointment = db.appointments.find((a) => a.id === id)
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    if (appointment.userId !== user.userId && user.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to reschedule this appointment" },
        { status: 403 }
      )
    }

    const newSlot = db.slots.find((s) => s.id === newSlotId)
    if (!newSlot) {
      return NextResponse.json(
        { error: "New slot not found" },
        { status: 404 }
      )
    }

    if (!newSlot.isAvailable) {
      return NextResponse.json(
        { error: "The selected slot is not available" },
        { status: 400 }
      )
    }

    // Free up old slot
    const oldSlot = db.slots.find((s) => s.id === appointment.slotId)
    if (oldSlot) {
      oldSlot.isAvailable = true
    }

    // Reserve new slot
    newSlot.isAvailable = false

    // Update appointment
    appointment.slotId = newSlot.id
    appointment.slot = { ...newSlot }
    appointment.status = "rescheduled"

    return NextResponse.json({ appointment })
  } catch (err) {
    console.error("Reschedule error:", err)
    return NextResponse.json(
      { error: "Failed to reschedule appointment" },
      { status: 500 }
    )
  }
}

// DELETE /api/appointments/:id - Cancel
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDb()

    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id } = await context.params

    const appointment = db.appointments.find((a) => a.id === id)
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    if (appointment.userId !== user.userId && user.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to cancel this appointment" },
        { status: 403 }
      )
    }

    // Free up the slot
    const slot = db.slots.find((s) => s.id === appointment.slotId)
    if (slot) {
      slot.isAvailable = true
    }

    appointment.status = "cancelled"

    return NextResponse.json({ message: "Appointment cancelled successfully" })
  } catch (err) {
    console.error("Cancel appointment error:", err)
    return NextResponse.json(
      { error: "Failed to cancel appointment" },
      { status: 500 }
    )
  }
}
