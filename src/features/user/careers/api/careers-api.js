import { fetchData, API_BASE_URL } from "lib/api"

/** @param {string} path */
export const thumbUrl = (path) => `${API_BASE_URL}/uploads/${path}`

/** @returns {Promise<{jobs: import("./careers-types").PublicJob[]}>} */
export async function getPublicJobs() {
  return fetchData("careers", null, "GET")
}

/** @param {string} id */
export async function getPublicJob(id) {
  return fetchData(`careers/${id}`, null, "GET")
}

/** @param {FormData} fd */
export async function applyJob(fd) {
  return fetchData("careers/apply", fd, "POST", null, true)
}
