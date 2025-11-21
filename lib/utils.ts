import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extract error message from API response
 */
export function getError({
  data,
  placeholder,
}: {
  data: any
  placeholder: string
}): string {
  if (!data) return placeholder

  // Check common error message fields
  if (typeof data.error === "string") return data.error
  if (typeof data.message === "string") return data.message
  if (typeof data.error_message === "string") return data.error_message

  // Check nested error objects
  if (data.error && typeof data.error.message === "string") {
    return data.error.message
  }

  // CoinMarketCap specific
  if (data.status && typeof data.status.error_message === "string") {
    return data.status.error_message
  }

  return placeholder
}

/**
 * Extract error code from API response
 */
export function getErrorCode({ data }: { data: any }): string | null {
  if (!data) return null

  // Check common error code fields
  if (typeof data.code === "string" || typeof data.code === "number") {
    return String(data.code)
  }
  if (typeof data.error_code === "string" || typeof data.error_code === "number") {
    return String(data.error_code)
  }

  // Check nested error objects
  if (data.error && (typeof data.error.code === "string" || typeof data.error.code === "number")) {
    return String(data.error.code)
  }

  // CoinMarketCap specific
  if (data.status && (typeof data.status.error_code === "string" || typeof data.status.error_code === "number")) {
    return String(data.status.error_code)
  }

  return null
}
