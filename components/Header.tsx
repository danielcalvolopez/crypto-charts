"use client"

import { ThemeToggle } from "./ThemeToggle"
import { CryptoSearch, type CryptoOption } from "./CryptoSearch"
import LogoSvg from "./LogoSvg"
import AuthButton from "./AuthButton"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { LogOut, CircleUserRound, Palette } from "lucide-react"

interface HeaderProps {
  cryptocurrencies: CryptoOption[]
}

const Header = ({ cryptocurrencies }: HeaderProps) => {
  const { data } = useSession()

  const handleCryptoSelect = (crypto: CryptoOption) => {
    console.log("Selected crypto:", crypto)
  }

  // Get user initials for avatar fallback
  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  const userName = data?.user?.name?.split(" ")[0]
  const userMail = data?.user?.email

  return (
    <div className="p-4">
      <nav className="flex items-center justify-between">
        <LogoSvg />
        <div className="flex gap-4 items-center">
          <CryptoSearch
            options={cryptocurrencies}
            onSelect={handleCryptoSelect}
            placeholder="Search cryptocurrencies..."
          />

          {data?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full">
                <Avatar>
                  <AvatarImage
                    src={data.user.image || undefined}
                    alt={data.user.name || "User"}
                  />
                  <AvatarFallback>
                    {getUserInitials(data.user.name, data.user.email)}
                  </AvatarFallback>
                </Avatar>

                {/* <CircleUserRound size={35} /> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="flex gap-2 items-center px-2 py-1.5">
                  <Avatar>
                    <AvatarImage
                      src={data.user.image || undefined}
                      alt={data.user.name || "User"}
                    />
                    <AvatarFallback>
                      {getUserInitials(data.user.name, data.user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{userName}</p>
                    <p className="text-xs opacity-70">{userMail}</p>
                  </div>
                </div>

                <DropdownMenuSeparator />
                <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <Palette size={16} /> Theme
                  </div>
                  <ThemeToggle />
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={async () => await signOut()}
                >
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthButton />
          )}
        </div>
      </nav>
    </div>
  )
}

export default Header
