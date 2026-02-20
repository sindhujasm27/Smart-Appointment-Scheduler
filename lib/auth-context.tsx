"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"

interface UserInfo {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: UserInfo | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<{ error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedToken = window.sessionStorage.getItem("ss_token")
      const savedUser = window.sessionStorage.getItem("ss_user")
      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch {
      // sessionStorage not available (SSR)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { error: data.error || "Login failed" }

      setToken(data.token)
      setUser(data.user)
      try {
        window.sessionStorage.setItem("ss_token", data.token)
        window.sessionStorage.setItem("ss_user", JSON.stringify(data.user))
      } catch {
        // storage not available
      }
      return {}
    } catch {
      return { error: "Network error. Please try again." }
    }
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string, role: string) => {
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        })
        const data = await res.json()
        if (!res.ok) return { error: data.error || "Registration failed" }

        setToken(data.token)
        setUser(data.user)
        try {
          window.sessionStorage.setItem("ss_token", data.token)
          window.sessionStorage.setItem("ss_user", JSON.stringify(data.user))
        } catch {
          // storage not available
        }
        return {}
      } catch {
        return { error: "Network error. Please try again." }
      }
    },
    []
  )

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    try {
      window.sessionStorage.removeItem("ss_token")
      window.sessionStorage.removeItem("ss_user")
    } catch {
      // storage not available
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
