"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CalendarDays,
  Clock,
  Loader2,
  Plus,
  Trash2,
  Users,
  CalendarCheck,
  ClipboardList,
} from "lucide-react"

interface Slot {
  id: string
  providerId: string
  providerName: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface Appointment {
  id: string
  userId: string
  userName: string
  slotId: string
  slot: Slot
  status: string
  createdAt: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function AdminDashboard() {
  const { token } = useAuth()
  const [slots, setSlots] = useState<Slot[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deletingSlot, setDeletingSlot] = useState<string | null>(null)

  // Form state for creating new slot
  const [slotDate, setSlotDate] = useState("")
  const [slotStartHour, setSlotStartHour] = useState("09")
  const [slotStartMin, setSlotStartMin] = useState("00")
  const [slotEndHour, setSlotEndHour] = useState("10")
  const [slotEndMin, setSlotEndMin] = useState("00")
  const [createError, setCreateError] = useState("")

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [slotsData, apptsData] = await Promise.all([
        apiFetch("/api/slots?all=true", {}, token),
        apiFetch("/api/appointments", {}, token),
      ])
      setSlots(slotsData.slots)
      setAppointments(apptsData.appointments)
    } catch (err) {
      console.error("Failed to fetch data:", err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault()
    setCreateError("")

    if (!slotDate) {
      setCreateError("Please select a date")
      return
    }

    const startTime = new Date(
      `${slotDate}T${slotStartHour}:${slotStartMin}:00`
    )
    const endTime = new Date(`${slotDate}T${slotEndHour}:${slotEndMin}:00`)

    if (endTime <= startTime) {
      setCreateError("End time must be after start time")
      return
    }

    try {
      setCreating(true)
      await apiFetch(
        "/api/slots",
        {
          method: "POST",
          body: JSON.stringify({
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          }),
        },
        token
      )
      // Reset form
      setSlotDate("")
      setSlotStartHour("09")
      setSlotStartMin("00")
      setSlotEndHour("10")
      setSlotEndMin("00")
      await fetchData()
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create slot")
    } finally {
      setCreating(false)
    }
  }

  async function handleDeleteSlot(slotId: string) {
    try {
      setDeletingSlot(slotId)
      await apiFetch(`/api/slots/${slotId}`, { method: "DELETE" }, token)
      await fetchData()
    } catch (err) {
      console.error("Delete failed:", err)
    } finally {
      setDeletingSlot(null)
    }
  }

  const availableSlots = slots.filter((s) => s.isAvailable)
  const bookedSlots = slots.filter((s) => !s.isAvailable)
  const activeAppointments = appointments.filter(
    (a) => a.status === "booked" || a.status === "rescheduled"
  )

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#2563eb]" />
      </div>
    )
  }

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  )
  const minutes = ["00", "15", "30", "45"]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#2563eb]/10">
              <CalendarDays className="size-6 text-[#2563eb]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {slots.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Slots</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#16a34a]/10">
              <Clock className="size-6 text-[#16a34a]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {availableSlots.length}
              </p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#ca8a04]/10">
              <CalendarCheck className="size-6 text-[#ca8a04]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {bookedSlots.length}
              </p>
              <p className="text-sm text-muted-foreground">Booked</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#7c3aed]/10">
              <Users className="size-6 text-[#7c3aed]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {activeAppointments.length}
              </p>
              <p className="text-sm text-muted-foreground">Active Bookings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="manage" className="flex-1 sm:flex-none">
            <CalendarDays className="mr-1.5 size-4" />
            Manage Slots
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex-1 sm:flex-none">
            <ClipboardList className="mr-1.5 size-4" />
            All Appointments
          </TabsTrigger>
        </TabsList>

        {/* Manage Slots Tab */}
        <TabsContent value="manage">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Create Slot Form */}
            <Card className="border-border lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="size-5 text-[#2563eb]" />
                  Create New Slot
                </CardTitle>
                <CardDescription>
                  Add a new appointment time slot for patients to book.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSlot} className="flex flex-col gap-4">
                  {createError && (
                    <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                      {createError}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="slot-date">Date</Label>
                    <Input
                      id="slot-date"
                      type="date"
                      value={slotDate}
                      onChange={(e) => setSlotDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Start Time</Label>
                    <div className="flex items-center gap-2">
                      <select
                        value={slotStartHour}
                        onChange={(e) => setSlotStartHour(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs"
                        aria-label="Start hour"
                      >
                        {hours.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <span className="text-muted-foreground">:</span>
                      <select
                        value={slotStartMin}
                        onChange={(e) => setSlotStartMin(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs"
                        aria-label="Start minute"
                      >
                        {minutes.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>End Time</Label>
                    <div className="flex items-center gap-2">
                      <select
                        value={slotEndHour}
                        onChange={(e) => setSlotEndHour(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs"
                        aria-label="End hour"
                      >
                        {hours.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <span className="text-muted-foreground">:</span>
                      <select
                        value={slotEndMin}
                        onChange={(e) => setSlotEndMin(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs"
                        aria-label="End minute"
                      >
                        {minutes.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="mt-2 w-full bg-[#2563eb] text-[#f8fafc] hover:bg-[#1d4ed8]"
                    disabled={creating}
                  >
                    {creating && <Loader2 className="size-4 animate-spin" />}
                    <Plus className="size-4" />
                    Create Slot
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Slots */}
            <Card className="border-border lg:col-span-2">
              <CardHeader>
                <CardTitle>All Slots</CardTitle>
                <CardDescription>
                  Manage your time slots. Delete unused or create new ones.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {slots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <CalendarDays className="mb-4 size-12 text-muted-foreground/40" />
                    <p className="text-lg font-medium text-foreground">
                      No Slots Created
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Use the form to create your first time slot.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {slots.map((slot) => (
                          <TableRow key={slot.id}>
                            <TableCell className="font-medium">
                              {formatDate(slot.startTime)}
                            </TableCell>
                            <TableCell>
                              {formatTime(slot.startTime)} -{" "}
                              {formatTime(slot.endTime)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={slot.isAvailable ? "default" : "secondary"}
                                className={
                                  slot.isAvailable
                                    ? "bg-[#16a34a] text-[#f8fafc]"
                                    : "bg-[#64748b] text-[#f8fafc]"
                                }
                              >
                                {slot.isAvailable ? "Available" : "Booked"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                disabled={
                                  deletingSlot === slot.id || !slot.isAvailable
                                }
                                onClick={() => handleDeleteSlot(slot.id)}
                              >
                                {deletingSlot === slot.id ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="size-3.5" />
                                )}
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* All Appointments Tab */}
        <TabsContent value="appointments">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>All Booked Appointments</CardTitle>
              <CardDescription>
                View all patient appointments and their current status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ClipboardList className="mb-4 size-12 text-muted-foreground/40" />
                  <p className="text-lg font-medium text-foreground">
                    No Appointments Yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Appointments will appear here once patients book slots.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Booked On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appt) => (
                        <TableRow key={appt.id}>
                          <TableCell className="font-medium">
                            {appt.userName}
                          </TableCell>
                          <TableCell>
                            {formatDate(appt.slot.startTime)}
                          </TableCell>
                          <TableCell>
                            {formatTime(appt.slot.startTime)} -{" "}
                            {formatTime(appt.slot.endTime)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                appt.status === "cancelled"
                                  ? "destructive"
                                  : "default"
                              }
                              className={
                                appt.status === "booked"
                                  ? "bg-[#16a34a] text-[#f8fafc]"
                                  : appt.status === "rescheduled"
                                  ? "bg-[#ca8a04] text-[#f8fafc]"
                                  : ""
                              }
                            >
                              {appt.status.charAt(0).toUpperCase() +
                                appt.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(appt.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
