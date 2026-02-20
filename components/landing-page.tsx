"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CalendarDays,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

const features = [
  {
    icon: CalendarDays,
    title: "Smart Scheduling",
    description:
      "Browse available time slots and book appointments with just one click. No phone calls needed.",
  },
  {
    icon: Clock,
    title: "Real-Time Availability",
    description:
      "See live slot availability. Instantly know what times work for your schedule.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description:
      "JWT-based authentication with bcrypt password hashing keeps your data safe and secure.",
  },
  {
    icon: Zap,
    title: "Instant Management",
    description:
      "Reschedule or cancel appointments anytime. Providers manage slots from a dedicated dashboard.",
  },
]

const benefits = [
  "Book appointments in seconds",
  "Reschedule or cancel anytime",
  "Provider dashboard for slot management",
  "Role-based access for Users & Admins",
  "Real-time slot availability",
  "Secure JWT authentication",
]

export function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eff6ff] to-background pb-20 pt-20 sm:pb-32 sm:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.12),transparent)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2563eb]/20 bg-[#2563eb]/5 px-4 py-1.5 text-sm font-medium text-[#2563eb]">
            <Zap className="size-4" />
            Smart Appointment System
          </div>
          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Schedule Appointments{" "}
            <span className="text-[#2563eb]">Effortlessly</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            A complete appointment scheduling platform with user booking,
            provider management, real-time availability, and secure
            authentication. Built with Node.js and REST APIs.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-[#2563eb] px-8 text-[#f8fafc] hover:bg-[#1d4ed8]"
              asChild
            >
              <a href="/register">
                Get Started Free
                <ArrowRight className="ml-1 size-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="px-8" asChild>
              <a href="/login">Sign In to Dashboard</a>
            </Button>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-8 rounded-xl border border-border bg-card p-4 text-left text-sm shadow-sm sm:p-5">
            <p className="mb-2 font-semibold text-foreground">
              Demo Credentials:
            </p>
            <div className="flex flex-col gap-1.5 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Admin:</span>{" "}
                admin@clinic.com / admin123
              </p>
              <p>
                <span className="font-medium text-foreground">User:</span>{" "}
                user@example.com / user123
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            A full-featured scheduling system with separate dashboards for users
            and providers.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border bg-card transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-[#2563eb]/10">
                  <feature.icon className="size-5 text-[#2563eb]" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y border-border bg-secondary/50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built for Both Users & Providers
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Whether you are booking an appointment or managing your clinic
                schedule, SmartSchedule has you covered.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#16a34a]" />
                  <span className="text-sm font-medium text-foreground">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            REST API Architecture
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Clean RESTful endpoints powering the entire scheduling system.
          </p>
        </div>
        <div className="mt-12 overflow-hidden rounded-xl border border-border bg-[#0f172a]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-3 font-mono text-sm">
              {[
                { method: "POST", path: "/api/register", desc: "Create account" },
                { method: "POST", path: "/api/login", desc: "Authenticate" },
                { method: "GET", path: "/api/slots", desc: "Available slots" },
                { method: "POST", path: "/api/slots", desc: "Create slot (Admin)" },
                { method: "DELETE", path: "/api/slots/:id", desc: "Delete slot (Admin)" },
                { method: "GET", path: "/api/appointments", desc: "My bookings" },
                { method: "POST", path: "/api/appointments", desc: "Book slot" },
                { method: "PUT", path: "/api/appointments/:id", desc: "Reschedule" },
                { method: "DELETE", path: "/api/appointments/:id", desc: "Cancel" },
              ].map((endpoint) => (
                <div
                  key={endpoint.path + endpoint.method}
                  className="flex items-center gap-3"
                >
                  <span
                    className={`inline-flex w-16 shrink-0 justify-center rounded px-2 py-0.5 text-xs font-bold ${
                      endpoint.method === "GET"
                        ? "bg-[#16a34a]/20 text-[#4ade80]"
                        : endpoint.method === "POST"
                        ? "bg-[#2563eb]/20 text-[#60a5fa]"
                        : endpoint.method === "PUT"
                        ? "bg-[#ca8a04]/20 text-[#fbbf24]"
                        : "bg-[#dc2626]/20 text-[#f87171]"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <span className="text-[#e2e8f0]">{endpoint.path}</span>
                  <span className="text-[#64748b]">{"// "}{endpoint.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>
            SmartSchedule - Full-Stack Appointment Scheduling System. Built with
            Next.js, Node.js, JWT Auth & REST APIs.
          </p>
        </div>
      </footer>
    </div>
  )
}
