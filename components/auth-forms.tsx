"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CalendarCheck, Loader2 } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await login(email, password)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-[#eff6ff] to-background px-4 py-12">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-[#2563eb]/10">
            <CalendarCheck className="size-6 text-[#2563eb]" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your SmartSchedule account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
              <p className="mb-1 font-semibold text-foreground">Demo Accounts:</p>
              <p>Admin: admin@clinic.com / admin123</p>
              <p>User: user@example.com / user123</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full bg-[#2563eb] text-[#f8fafc] hover:bg-[#1d4ed8]"
              disabled={loading}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Sign In
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <a href="/register" className="font-medium text-[#2563eb] hover:underline">
                Register
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export function RegisterForm() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"user" | "admin">("user")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await register(name, email, password, role)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-[#eff6ff] to-background px-4 py-12">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-[#2563eb]/10">
            <CalendarCheck className="size-6 text-[#2563eb]" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Join SmartSchedule to start booking appointments
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Account Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-sm transition-colors ${
                    role === "user"
                      ? "border-[#2563eb] bg-[#2563eb]/5 text-[#2563eb]"
                      : "border-border bg-card text-muted-foreground hover:border-[#2563eb]/30"
                  }`}
                >
                  <span className="font-semibold">User</span>
                  <span className="text-xs">Book appointments</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-sm transition-colors ${
                    role === "admin"
                      ? "border-[#2563eb] bg-[#2563eb]/5 text-[#2563eb]"
                      : "border-border bg-card text-muted-foreground hover:border-[#2563eb]/30"
                  }`}
                >
                  <span className="font-semibold">Provider</span>
                  <span className="text-xs">Manage slots</span>
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full bg-[#2563eb] text-[#f8fafc] hover:bg-[#1d4ed8]"
              disabled={loading}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Create Account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-[#2563eb] hover:underline">
                Sign In
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
