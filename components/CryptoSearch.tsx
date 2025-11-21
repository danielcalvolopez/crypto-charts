"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image"
import { Skeleton } from "./ui/skeleton"

export interface CryptoOption {
  value: string
  label: string
  symbol: string
  logo?: string
  id?: number
  rank?: number
}

interface CryptoSearchProps {
  options: CryptoOption[]
  onSelect?: (crypto: CryptoOption) => void
  placeholder?: string
  className?: string
}

export function CryptoSearch({
  options,
  onSelect,
  placeholder = "Search cryptocurrencies...",
  className,
}: CryptoSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  // Use deferred value to keep input responsive
  const deferredQuery = React.useDeferredValue(inputValue)

  // Pre-compute lowercase search terms for better performance
  const searchableOptions = React.useMemo(
    () =>
      options.map((option) => ({
        ...option,
        lowerLabel: option.label.toLowerCase(),
        lowerSymbol: option.symbol.toLowerCase(),
      })),
    [options]
  )

  // Filter based on deferred value - this won't block input
  const filteredOptions = React.useMemo(() => {
    if (!deferredQuery) return []

    const lowerQuery = deferredQuery.toLowerCase()
    const results: CryptoOption[] = []

    // Early termination once we have 50 results
    for (const option of searchableOptions) {
      if (
        option.lowerLabel.includes(lowerQuery) ||
        option.lowerSymbol.includes(lowerQuery)
      ) {
        results.push(option)
        if (results.length >= 50) break
      }
    }

    return results
  }, [deferredQuery, searchableOptions])

  // Show loading when input is ahead of deferred value
  const isLoading = inputValue !== deferredQuery

  const handleSelect = (currentValue: string) => {
    const selectedCrypto = options.find(
      (option) => option.value === currentValue
    )
    if (selectedCrypto) {
      onSelect?.(selectedCrypto)
    }
    setInputValue("")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative", className)}>
        <PopoverAnchor asChild>
          <div className="relative w-60">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="h-9 shadow-md w-full hover:bg-secondary/40 focus:ring-2 ring-ring rounded-md border border-input bg-background px-10 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="p-0 w-60"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command shouldFilter={false}>
            <CommandList className="w-full">
              {isLoading ? (
                <div className="p-2 space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-1crypto">
                      {/* <div className="w-[30px] h-[30px] rounded-full bg-secondary animate-pulse" /> */}
                      <Skeleton className="w-[30px] h-[30px] bg-secondary rounded-full" />
                      <div className="flex-1 space-y-2">
                        {/* <div className="h-4 bg-secondary rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-secondary rounded animate-pulse w-1/2" /> */}

                        <Skeleton className="h-4 w-3/4 bg-secondary rounded" />
                        <Skeleton className="h-3 w-1/2 bg-secondary rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    {!inputValue
                      ? "Start typing to search..."
                      : "No cryptocurrencies found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={handleSelect}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        {option.logo && (
                          <Image
                            src={option.logo}
                            alt={option.symbol}
                            className="rounded-full"
                            width={30}
                            height={30}
                          />
                        )}
                        <div className="flex items-start flex-col gap-1">
                          <Tooltip>
                            <TooltipTrigger className="font-medium truncate max-w-40">
                              <span>{option.label}</span>
                            </TooltipTrigger>
                            <TooltipContent>{option.label}</TooltipContent>
                          </Tooltip>
                          <span className="text-muted-foreground text-[0.7rem] flex gap-2 items-center">
                            {option.symbol}{" "}
                            <span className="bg-secondary text-foreground rounded-md px-2 py-0.5">
                              #{option.rank}
                            </span>
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  )
}
