"use server"

import { fetchGet } from "@/lib/fetch-wrapper"

export type QuoteData = {
  price: number
  volume_24h: number
  volume_change_24h: number
  percent_change_1h: number
  percent_change_24h: number
  percent_change_7d: number
  percent_change_30d: number
  percent_change_60d: number
  percent_change_90d: number
  market_cap: number
  market_cap_dominance: number
  fully_diluted_market_cap: number
  tvl: number | null
  last_updated: string
}

export type CoinType = {
  id: number
  name: string
  symbol: string
  slug: string
  num_market_pairs: number
  date_added: string
  tags: string[]
  max_supply: number | null
  circulating_supply: number
  total_supply: number
  platform: {
    id: number
    name: string
    symbol: string
    slug: string
    token_address: string
  } | null
  infinite_supply: boolean
  minted_market_cap: number
  cmc_rank: number
  self_reported_circulating_supply: number | null
  self_reported_market_cap: number | null
  tvl_ratio: number | null
  last_updated: string
  quote: {
    USD: QuoteData
  }
}

export type GetCMCListingsResponse = {
  data: CoinType[]
  status: {
    timestamp: string
    error_code: number
    error_message: string | null
    elapsed: number
    credit_count: number
    notice: string | null
  }
}

export interface GetCMCListingsActionResult {
  success: boolean
  error?: string | null
  status: number | undefined
  data?: GetCMCListingsResponse | null
}

const baseUrl = process.env.CMC_BACKEND_API || ""
const apiKey = process.env.COIN_MARKET_CAP_API_KEY || ""

/**
 * Get cryptocurrency listings from CoinMarketCap
 * @param limit Number of results to return (default: 100)
 */
export const getCMCListings = async (
  limit = 100
): Promise<GetCMCListingsActionResult> => {
  const url = `${baseUrl}/v1/cryptocurrency/listings/latest?limit=${limit}`

  const headers: Record<string, string> = {
    "X-CMC_PRO_API_KEY": apiKey,
  }

  console.log("CALL")

  const response = await fetchGet<GetCMCListingsResponse>({
    url,
    nextTags: ["get-cmc-listings"],
    placeholderError: "Error while getting cmc listings",
    headers,
  })

  return {
    success: response.success,
    error: response.error,
    status: response.status,
    data: response.data,
  }
}

/**
 * Get quote for a single cryptocurrency by symbol
 * @param symbol Cryptocurrency symbol (e.g., "BTC", "ETH")
 */

export type GetCMCQuoteResponse = {
  data: {
    [symbol: string]: CoinType[]
  }
  status: {
    timestamp: string
    error_code: number
    error_message: string | null
    elapsed: number
    credit_count: number
    notice: string | null
  }
}

export interface GetCMCQuoteActionResult {
  success: boolean
  error?: string | null
  status: number | undefined
  data?: GetCMCQuoteResponse | null
}

export const getCMCQuote = async (
  symbol: string
): Promise<GetCMCQuoteActionResult> => {
  const url = `${baseUrl}/v2/cryptocurrency/quotes/latest?symbol=${symbol.toUpperCase()}`

  const headers: Record<string, string> = {
    "X-CMC_PRO_API_KEY": apiKey,
  }

  const response = await fetchGet<GetCMCQuoteResponse>({
    url,
    nextTags: [`get-cmc-quote-${symbol}`],
    placeholderError: `Error while getting ${symbol} data`,
    headers,
  })

  return {
    success: response.success,
    error: response.error,
    status: response.status,
    data: response.data,
  }
}

/**
 * Get quote for a single cryptocurrency by ID
 * @param id CoinMarketCap cryptocurrency ID
 */
export const getCMCQuoteById = async (
  id: number
): Promise<GetCMCQuoteActionResult> => {
  const url = `${baseUrl}/v2/cryptocurrency/quotes/latest?id=${id}`

  const headers: Record<string, string> = {
    "X-CMC_PRO_API_KEY": apiKey,
  }

  const response = await fetchGet<GetCMCQuoteResponse>({
    url,
    nextTags: [`get-cmc-quote-${id}`],
    placeholderError: `Error while getting cryptocurrency data`,
    headers,
  })

  return {
    success: response.success,
    error: response.error,
    status: response.status,
    data: response.data,
  }
}
