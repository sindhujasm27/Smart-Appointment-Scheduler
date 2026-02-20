import { db, type User } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "appointment-scheduler-secret-key-2024"

export interface JWTPayload {
  userId: string
  email: string
  role: "user" | "admin"
  name: string
}

export function signToken(user: User): string {
  // Use dynamic import workaround for jsonwebtoken CJS module
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const jwt = require("jsonwebtoken")
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    } as JWTPayload,
    JWT_SECRET,
    { expiresIn: "24h" }
  )
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jwt = require("jsonwebtoken")
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export function getUserFromRequest(request: Request): JWTPayload | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  const token = authHeader.split(" ")[1]
  return verifyToken(token)
}

export function findUserById(id: string): User | undefined {
  return db.users.find((u) => u.id === id)
}

export function findUserByEmail(email: string): User | undefined {
  return db.users.find((u) => u.email === email)
}
