// In-memory database store for the appointment scheduling system

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "user" | "admin"
}

export interface AppointmentSlot {
  id: string
  providerId: string
  providerName: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface Appointment {
  id: string
  userId: string
  userName: string
  slotId: string
  slot: AppointmentSlot
  status: "booked" | "cancelled" | "rescheduled"
  createdAt: string
}

// Global store persists across API calls within same server instance
const globalForDb = globalThis as unknown as {
  db: {
    users: User[]
    slots: AppointmentSlot[]
    appointments: Appointment[]
    initialized: boolean
  }
}

if (!globalForDb.db) {
  globalForDb.db = {
    users: [],
    slots: [],
    appointments: [],
    initialized: false,
  }
}

export const db = globalForDb.db

// Seed initial data
export async function initializeDb() {
  if (db.initialized) return

  const bcrypt = await import("bcryptjs")

  // Create default admin
  const adminPassword = await bcrypt.hash("admin123", 10)
  db.users.push({
    id: "admin-1",
    name: "Dr. Priya Sharma",
    email: "admin@clinic.com",
    password: adminPassword,
    role: "admin",
  })

  // Create a demo user
  const userPassword = await bcrypt.hash("user123", 10)
  db.users.push({
    id: "user-1",
    name: "Ravi Kumar",
    email: "user@example.com",
    password: userPassword,
    role: "user",
  })

  // Create default slots for the next 7 days
  const today = new Date()
  const slots: Omit<AppointmentSlot, "id">[] = []

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today)
    date.setDate(today.getDate() + dayOffset)

    const hours = [9, 10, 11, 14, 15, 16]
    for (const hour of hours) {
      const start = new Date(date)
      start.setHours(hour, 0, 0, 0)
      const end = new Date(date)
      end.setHours(hour + 1, 0, 0, 0)

      slots.push({
        providerId: "admin-1",
        providerName: "Dr. Priya Sharma",
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        isAvailable: true,
      })
    }
  }

  db.slots = slots.map((slot, index) => ({
    ...slot,
    id: `slot-${index + 1}`,
  }))

  db.initialized = true
}

// Helper to generate unique IDs
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
