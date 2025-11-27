"use client"

import { Button } from "./ui/button"
import { useSession, signIn, signOut } from "next-auth/react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Button disabled>Loading...</Button>
  }

  const handleSignIn = async () => {
    await signIn("google")
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (session?.user) {
    return <Button onClick={handleSignOut}>Sign out</Button>
  }

  return <Button onClick={handleSignIn}>Sign in with Google</Button>
}
