"use client"

import { Navbar } from "@/components/navbar"
import { LoginForm } from "@/components/auth-forms"

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main>
        <LoginForm />
      </main>
    </>
  )
}
