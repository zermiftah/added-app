import { fetchData, API_BASE_URL } from "lib/api"

/** @param {string} path */
export const thumbUrl = (path) => `${API_BASE_URL}/uploads/${path}`

/**
 * @param {string} token
 * @param {"active"|"draft"|"closed"|"all"} [status]
 * @returns {Promise<{jobs: import("./jobs-types").Job[]}>}
 */
export async function getJobs(token, status) {
  const qs = status && status !== "all" ? `?status=${status}` : ""
  return fetchData(`admin/careers${qs}`, null, "GET", token)
}

/**
 * @param {string} token
 * @returns {Promise<{departments: import("./jobs-types").Department[]}>}
 */
export async function getDepartments(token) {
  return fetchData("admin/departments", null, "GET", token)
}

/**
 * @param {FormData} fd
 * @param {string} token
 * @param {string} [id]
 */
export async function saveJob(fd, token, id) {
  const path = id ? `admin/careers/${id}` : "admin/careers"
  const method = id ? "PUT" : "POST"
  return fetchData(path, fd, method, token, true)
}

/**
 * @param {string} id
 * @param {string} token
 */
export async function deleteJob(id, token) {
  return fetchData(`admin/careers/${id}`, null, "DELETE", token)
}

/**
 * @param {string} id
 * @param {string} token
 */
export async function removeThumbnail(id, token) {
  return fetchData(`admin/careers/${id}/thumbnail`, null, "DELETE", token)
}

/**
 * @param {string} name
 * @param {string} token
 */
export async function addDepartment(name, token) {
  return fetchData("admin/departments", { name }, "POST", token)
}

/**
 * @param {number} id
 * @param {string} token
 */
export async function deleteDepartment(id, token) {
  return fetchData(`admin/departments/${id}`, null, "DELETE", token)
}
