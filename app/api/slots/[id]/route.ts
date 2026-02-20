import { NextResponse } from "next/server"
import { db, initializeDb } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

// DELETE /api/slots/:id
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDb()

    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      )
    }

    const { id } = await context.params

    const slotIndex = db.slots.findIndex((s) => s.id === id)
    if (slotIndex === -1) {
      return NextResponse.json(
        { error: "Slot not found" },
        { status: 404 }
      )
    }

    // Check if there is a booked appointment for this slot
    const hasBooking = db.appointments.some(
      (a) => a.slotId === id && a.status === "booked"
    )
    if (hasBooking) {
      return NextResponse.json(
        { error: "Cannot delete a slot with an active booking" },
        { status: 400 }
      )
    }

    db.slots.splice(slotIndex, 1)

    // Also remove any cancelled appointments for this slot
    for (let i = db.appointments.length - 1; i >= 0; i--) {
      if (db.appointments[i].slotId === id) {
        db.appointments.splice(i, 1)
      }
    }

    return NextResponse.json({ message: "Slot deleted successfully" })
  } catch (err) {
    console.error("Delete slot error:", err)
    return NextResponse.json(
      { error: "Failed to delete slot" },
      { status: 500 }
    )
  }
}
