import { NextResponse } from "next/server"
import { initializeDb } from "@/lib/db"
import { signToken, findUserByEmail } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    await initializeDb()

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const user = findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const bcrypt = await import("bcryptjs")
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const token = signToken(user)

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    )
  }
}
