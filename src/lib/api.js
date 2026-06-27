const API_BASE = import.meta.env.VITE_API_BASE || "https://zmiftah.tech/addedapi"

/**
 * Core fetch wrapper — mirrors sh-extranet networking pattern
 * @param {string} path
 * @param {object|null} data
 * @param {"GET"|"POST"|"PUT"|"DELETE"} method
 * @param {string|null} token
 * @param {boolean} multipart
 */
export async function fetchData(path, data = null, method = "GET", token = null, multipart = false) {
  const url = `${API_BASE}/${path}`

  const headers = {}
  if (token) headers["Authorization"] = `Bearer ${token}`
  if (!multipart) headers["Content-Type"] = "application/json"

  const body = method === "GET" ? undefined
    : multipart ? data
    : JSON.stringify(data ?? {})

  const res = await fetch(url, { method, headers, body })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
    throw new Error(err.message || `HTTP ${res.status}`)
  }

  return res.json()
}

export const API_BASE_URL = API_BASE
