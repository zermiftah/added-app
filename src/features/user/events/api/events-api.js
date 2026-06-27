import { fetchData } from "lib/api"

export async function getPublicEvents() {
  return fetchData("events", null, "GET")
}
