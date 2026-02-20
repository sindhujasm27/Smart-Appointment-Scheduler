"use client"

import { Navbar } from "@/components/navbar"
import { RegisterForm } from "@/components/auth-forms"

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main>
        <RegisterForm />
      </main>
    </>
  )
}
