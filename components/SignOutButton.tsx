"use client"

import { Button } from "./ui/button"
import { useSession, signOut } from "next-auth/react"

export default function SignOutButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Button disabled>Loading...</Button>
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <button
      onClick={handleSignOut}
      className="cursor-pointer w-full h-full text-left"
    >
      Sign out
    </button>
  )
}
