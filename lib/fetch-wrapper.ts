import { getError, getErrorCode } from "./utils"

export interface FetchWrapperConfig {
  url: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: unknown
  headers?: Record<string, string>
  cache?: RequestCache
  revalidate?: number
  nextTags?: string[]
  timeout?: number
  placeholderError?: string
}

export interface FetchWrapperResponse<T> {
  data: T | null
  error: string | null
  errorCode: string | null
  success: boolean
  status?: number
}

const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error occurred. Please check your connection.",
  TIMEOUT: "Request timed out. Please try again.",
} as const

// Helper function to create timeout promise
const createTimeoutPromise = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(ERROR_MESSAGES.TIMEOUT)), ms)
  })
}

// Helper function to build headers
const buildHeaders = (
  customHeaders?: Record<string, string>,
  body?: unknown
): HeadersInit => {
  const headers: Record<string, string> = {
    ...(customHeaders || {}),
  }

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  return headers
}

// Helper function to handle response
const handleResponse = async <T>(
  response: Response,
  placeholderError: string
): Promise<
  Omit<FetchWrapperResponse<T>, "data"> & { responseData: unknown }
> => {
  const responseData = await response.json().catch(() => null)

  if (response.ok) {
    return {
      responseData,
      error: null,
      errorCode: null,
      success: true,
      status: response.status,
    }
  }

  // Handle non-2xx responses
  const error = getError({ data: responseData, placeholder: placeholderError })
  const errorCode = getErrorCode({ data: responseData })

  return {
    responseData,
    error,
    errorCode,
    success: false,
    status: response.status,
  }
}

// Helper function for logging errors in development
const logError = (
  config: FetchWrapperConfig,
  response: Response,
  data: unknown,
  errorCode: string | null
): void => {
  if (process.env.NODE_ENV === "development") {
    console.error(
      `--------\nError while fetching from: ${config.url}\n`,
      `(${response.status}) ${response.statusText}\n method: ${config.method}\n`,
      JSON.stringify(data, null, 2),
      config.body
        ? `\nRequest Body: \n${JSON.stringify(config.body, null, 2)}`
        : "",
      config.headers
        ? `\nRequest Headers: \n${JSON.stringify(config.headers, null, 2)}`
        : "",
      `\nError Code: ${errorCode}\n--------`
    )
  }
}

/**
 * Enhanced fetch wrapper for CoinMarketCap API with improved error handling
 * @template T The expected response data type
 * @param config Fetch configuration object
 * @returns Promise with response data, error, and status information
 */
export const fetchWrapper = async <T = unknown>(
  config: FetchWrapperConfig
): Promise<FetchWrapperResponse<T>> => {
  const {
    url,
    method = "GET",
    body,
    nextTags,
    placeholderError = "An error occurred",
    revalidate,
    cache,
    headers,
    timeout = 30000, // Default 30 seconds timeout
  } = config

  try {
    // Build request configuration
    const requestConfig: RequestInit = {
      method,
      headers: buildHeaders(headers, body),
      ...(cache && { cache }),
      ...(nextTags ? { next: { tags: nextTags, revalidate } } : {}),
      ...(body && method !== "GET"
        ? { body: body instanceof FormData ? body : JSON.stringify(body) }
        : {}),
    }

    // Create fetch promise with timeout
    const fetchPromise = fetch(url, requestConfig)
    const racePromises =
      timeout > 0
        ? [fetchPromise, createTimeoutPromise(timeout)]
        : [fetchPromise]

    const response = (await Promise.race(racePromises)) as Response

    // Handle response
    const result = await handleResponse<T>(response, placeholderError)

    // Log errors in development
    if (!result.success && result.errorCode) {
      logError(config, response, result.responseData, result.errorCode)
    }

    return {
      data: result.success ? (result.responseData as T) : null,
      error: result.error,
      errorCode: result.errorCode,
      success: result.success,
      status: result.status,
    }
  } catch (error) {
    // Handle network errors and timeouts
    const isTimeout =
      error instanceof Error && error.message === ERROR_MESSAGES.TIMEOUT
    const errorMessage = isTimeout
      ? ERROR_MESSAGES.TIMEOUT
      : error instanceof Error
      ? error.message
      : placeholderError

    if (process.env.NODE_ENV === "development") {
      console.error(`Error while fetching from: ${url}\n`, error)
    }

    return {
      data: null,
      error: errorMessage,
      errorCode: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
      success: false,
    }
  }
}

/**
 * Typed fetch wrapper variants for common use cases
 */
export const fetchGet = <T = unknown>(
  config: Omit<FetchWrapperConfig, "method" | "body">
): Promise<FetchWrapperResponse<T>> => {
  return fetchWrapper<T>({ ...config, method: "GET" })
}

export const fetchPost = <T = unknown>(
  config: Omit<FetchWrapperConfig, "method">
): Promise<FetchWrapperResponse<T>> => {
  return fetchWrapper<T>({ ...config, method: "POST" })
}

export const fetchPut = <T = unknown>(
  config: Omit<FetchWrapperConfig, "method">
): Promise<FetchWrapperResponse<T>> => {
  return fetchWrapper<T>({ ...config, method: "PUT" })
}

export const fetchDelete = <T = unknown>(
  config: Omit<FetchWrapperConfig, "method">
): Promise<FetchWrapperResponse<T>> => {
  return fetchWrapper<T>({ ...config, method: "DELETE" })
}
