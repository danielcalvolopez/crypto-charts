"use client"

import { ThemeToggle } from "./ThemeToggle"
import { CryptoSearch, type CryptoOption } from "./CryptoSearch"

interface HeaderProps {
  cryptocurrencies: CryptoOption[]
}

const Header = ({ cryptocurrencies }: HeaderProps) => {
  const handleCryptoSelect = (crypto: CryptoOption) => {
    console.log("Selected crypto:", crypto)
    // Here you can navigate to a page, add to portfolio, etc.
  }

  return (
    <div className="p-6">
      <nav className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">watchly</h1>

        <div className="flex gap-4 items-center">
          <CryptoSearch
            options={cryptocurrencies}
            onSelect={handleCryptoSelect}
            placeholder="Search cryptocurrencies..."
          />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  )
}

export default Header
