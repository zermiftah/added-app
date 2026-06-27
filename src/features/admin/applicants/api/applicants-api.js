import { fetchData, API_BASE_URL } from "lib/api"

/** @param {string} path */
export const cvUrl = (path) => `${API_BASE_URL}/uploads/${path}`

/**
 * @param {import("./applicants-types").ApplicationFilter} filter
 * @param {string} token
 */
export async function getApplications(filter = {}, token) {
  const params = new URLSearchParams()
  Object.entries(filter).forEach(([k, v]) => { if (v && v !== "all") params.set(k, v) })
  const qs = params.toString()
  return fetchData(`admin/applications${qs ? `?${qs}` : ""}`, null, "GET", token)
}

/**
 * @param {string} id
 * @param {import("./applicants-types").UpdateStatusRequest} data
 * @param {string} token
 */
export async function updateApplicationStatus(id, data, token) {
  return fetchData(`admin/applications/${id}/status`, data, "PUT", token)
}

/**
 * Export applications to Excel
 * @param {import("./applicants-types").ApplicationFilter} filter
 * @param {string} token
 */
export async function exportApplicationsExcel(filter = {}, token) {
  const params = new URLSearchParams({ format: "xlsx" })
  Object.entries(filter).forEach(([k, v]) => { if (v && v !== "all") params.set(k, v) })
  const res = await fetch(`${API_BASE_URL}/admin/applications?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Export failed")
  return res.blob()
}
