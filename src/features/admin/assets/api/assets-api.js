import { fetchData, API_BASE_URL } from "lib/api"

export const assetUrl = (filename) =>
  `${API_BASE_URL}/uploads/addededucation-assets/${filename}`

export async function getAssets(token) {
  return fetchData("assets", null, "GET", token)
}

export async function uploadAsset(file, token) {
  const fd = new FormData()
  fd.append("file", file)
  return fetchData("assets/upload", fd, "POST", token, true)
}

export async function deleteAsset(filename, token) {
  return fetchData(`assets/${encodeURIComponent(filename)}`, null, "DELETE", token)
}
