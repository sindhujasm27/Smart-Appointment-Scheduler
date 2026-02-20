import { NextResponse } from "next/server"
import { db, initializeDb, generateId } from "@/lib/db"
import { signToken, findUserByEmail } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    await initializeDb()

    const body = await request.json()
    const { name, email, password, role = "user" } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    if (findUserByEmail(email)) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    const bcrypt = await import("bcryptjs")
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = {
      id: generateId("user"),
      name,
      email,
      password: hashedPassword,
      role: role as "user" | "admin",
    }

    db.users.push(newUser)
    const token = signToken(newUser)

    return NextResponse.json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (err) {
    console.error("Registration error:", err)
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}
