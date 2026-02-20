"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  CalendarPlus,
  XCircle,
  RefreshCw,
  CalendarCheck,
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

function formatDateFull(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function UserDashboard() {
  const { token } = useAuth()
  const [slots, setSlots] = useState<Slot[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingSlot, setBookingSlot] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [rescheduleAppt, setRescheduleAppt] = useState<Appointment | null>(null)
  const [rescheduleSlot, setRescheduleSlot] = useState<string>("")
  const [rescheduling, setRescheduling] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [slotsData, apptsData] = await Promise.all([
        apiFetch("/api/slots", {}, token),
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

  async function handleBook(slotId: string) {
    try {
      setBookingSlot(slotId)
      await apiFetch(
        "/api/appointments",
        {
          method: "POST",
          body: JSON.stringify({ slotId }),
        },
        token
      )
      await fetchData()
    } catch (err) {
      console.error("Booking failed:", err)
    } finally {
      setBookingSlot(null)
    }
  }

  async function handleCancel(appointmentId: string) {
    try {
      setCancellingId(appointmentId)
      await apiFetch(
        `/api/appointments/${appointmentId}`,
        { method: "DELETE" },
        token
      )
      await fetchData()
    } catch (err) {
      console.error("Cancel failed:", err)
    } finally {
      setCancellingId(null)
    }
  }

  async function handleReschedule() {
    if (!rescheduleAppt || !rescheduleSlot) return
    try {
      setRescheduling(true)
      await apiFetch(
        `/api/appointments/${rescheduleAppt.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ newSlotId: rescheduleSlot }),
        },
        token
      )
      setRescheduleAppt(null)
      setRescheduleSlot("")
      await fetchData()
    } catch (err) {
      console.error("Reschedule failed:", err)
    } finally {
      setRescheduling(false)
    }
  }

  const activeAppointments = appointments.filter(
    (a) => a.status === "booked" || a.status === "rescheduled"
  )
  const pastAppointments = appointments.filter((a) => a.status === "cancelled")

  // Group slots by date
  const slotsByDate = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    const dateKey = new Date(slot.startTime).toDateString()
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(slot)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#2563eb]" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#2563eb]/10">
              <CalendarDays className="size-6 text-[#2563eb]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {slots.length}
              </p>
              <p className="text-sm text-muted-foreground">Available Slots</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#16a34a]/10">
              <CalendarCheck className="size-6 text-[#16a34a]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {activeAppointments.length}
              </p>
              <p className="text-sm text-muted-foreground">Active Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#dc2626]/10">
              <XCircle className="size-6 text-[#dc2626]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {pastAppointments.length}
              </p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="slots" className="w-full">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="slots" className="flex-1 sm:flex-none">
            <CalendarDays className="mr-1.5 size-4" />
            Available Slots
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex-1 sm:flex-none">
            <CalendarCheck className="mr-1.5 size-4" />
            My Bookings
          </TabsTrigger>
        </TabsList>

        {/* Available Slots Tab */}
        <TabsContent value="slots">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Available Appointment Slots</CardTitle>
              <CardDescription>
                Browse and book from the available time slots below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(slotsByDate).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CalendarDays className="mb-4 size-12 text-muted-foreground/40" />
                  <p className="text-lg font-medium text-foreground">
                    No Available Slots
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Check back later for new openings.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {Object.entries(slotsByDate).map(([dateKey, dateSlots]) => (
                    <div key={dateKey}>
                      <div className="mb-4 flex items-center gap-2">
                        <CalendarDays className="size-4 text-[#2563eb]" />
                        <h3 className="text-sm font-semibold text-foreground">
                          {formatDateFull(dateSlots[0].startTime)}
                        </h3>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {dateSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/30"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-lg bg-[#2563eb]/10">
                                <Clock className="size-5 text-[#2563eb]" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {formatTime(slot.startTime)} -{" "}
                                  {formatTime(slot.endTime)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {slot.providerName}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-[#2563eb] text-[#f8fafc] hover:bg-[#1d4ed8]"
                              disabled={bookingSlot === slot.id}
                              onClick={() => handleBook(slot.id)}
                            >
                              {bookingSlot === slot.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <CalendarPlus className="size-4" />
                              )}
                              Book
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Bookings Tab */}
        <TabsContent value="bookings">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>My Appointments</CardTitle>
              <CardDescription>
                View and manage your booked appointments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CalendarCheck className="mb-4 size-12 text-muted-foreground/40" />
                  <p className="text-lg font-medium text-foreground">
                    No Appointments Yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Book your first appointment from the Available Slots tab.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appt) => (
                        <TableRow key={appt.id}>
                          <TableCell className="font-medium">
                            {formatDate(appt.slot.startTime)}
                          </TableCell>
                          <TableCell>
                            {formatTime(appt.slot.startTime)} -{" "}
                            {formatTime(appt.slot.endTime)}
                          </TableCell>
                          <TableCell>{appt.slot.providerName}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                appt.status === "booked" ||
                                appt.status === "rescheduled"
                                  ? "default"
                                  : "destructive"
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
                          <TableCell className="text-right">
                            {(appt.status === "booked" ||
                              appt.status === "rescheduled") && (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setRescheduleAppt(appt)
                                    setRescheduleSlot("")
                                  }}
                                >
                                  <RefreshCw className="size-3.5" />
                                  <span className="hidden sm:inline">
                                    Reschedule
                                  </span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  disabled={cancellingId === appt.id}
                                  onClick={() => handleCancel(appt.id)}
                                >
                                  {cancellingId === appt.id ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                  ) : (
                                    <XCircle className="size-3.5" />
                                  )}
                                  <span className="hidden sm:inline">
                                    Cancel
                                  </span>
                                </Button>
                              </div>
                            )}
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

      {/* Reschedule Dialog */}
      <Dialog
        open={!!rescheduleAppt}
        onOpenChange={(open) => {
          if (!open) {
            setRescheduleAppt(null)
            setRescheduleSlot("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new time slot for your appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto">
            {slots.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No available slots for rescheduling.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setRescheduleSlot(slot.id)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                      rescheduleSlot === slot.id
                        ? "border-[#2563eb] bg-[#2563eb]/5"
                        : "border-border hover:bg-secondary/50"
                    }`}
                  >
                    <Clock
                      className={`size-4 ${
                        rescheduleSlot === slot.id
                          ? "text-[#2563eb]"
                          : "text-muted-foreground"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        {formatDate(slot.startTime)} &middot;{" "}
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {slot.providerName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRescheduleAppt(null)
                setRescheduleSlot("")
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#2563eb] text-[#f8fafc] hover:bg-[#1d4ed8]"
              disabled={!rescheduleSlot || rescheduling}
              onClick={handleReschedule}
            >
              {rescheduling && <Loader2 className="size-4 animate-spin" />}
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
