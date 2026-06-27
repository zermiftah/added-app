import { fetchData } from "lib/api"

/**
 * Login admin
 * @param {import("./auth-types").LoginRequest} data
 * @returns {Promise<import("./auth-types").LoginResponse>}
 */
export async function loginAdmin(data) {
  return fetchData("admin/login", data, "POST")
}
