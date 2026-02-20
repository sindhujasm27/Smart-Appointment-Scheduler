"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { CalendarCheck, LogOut, User, Shield } from "lucide-react"

export function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <CalendarCheck className="size-7 text-[#2563eb]" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            SmartSchedule
          </span>
        </a>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm text-secondary-foreground sm:flex">
                {user.role === "admin" ? (
                  <Shield className="size-4 text-[#2563eb]" />
                ) : (
                  <User className="size-4 text-[#2563eb]" />
                )}
                <span className="font-medium">{user.name}</span>
                <span className="text-muted-foreground">
                  ({user.role === "admin" ? "Provider" : "User"})
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="/login">Sign In</a>
              </Button>
              <Button
                size="sm"
                className="bg-[#2563eb] text-[#f8fafc] hover:bg-[#1d4ed8]"
                asChild
              >
                <a href="/register">Get Started</a>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
