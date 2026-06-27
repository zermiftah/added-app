import { fetchData, API_BASE_URL } from "lib/api"

/** @param {string} path */
export const thumbUrl = (path) => `${API_BASE_URL}/uploads/${path}`

/** @param {string} token */
export async function getAuthors(token) {
  return fetchData("blog/authors", null, "GET", token)
}

/**
 * @param {number} id
 * @param {string} token
 */
export async function getAuthorDetail(id, token) {
  return fetchData(`blog/authors/${id}`, null, "GET", token)
}

/**
 * @param {FormData} fd
 * @param {string} token
 * @param {number} [id]
 */
export async function saveAuthor(fd, token, id) {
  const path = id ? `blog/authors/${id}` : "blog/authors"
  return fetchData(path, fd, id ? "PUT" : "POST", token, true)
}

/**
 * @param {number} id
 * @param {string} token
 */
export async function deleteAuthor(id, token) {
  return fetchData(`blog/authors/${id}`, null, "DELETE", token)
}

/**
 * @param {number} id
 * @param {string} token
 */
export async function removeAuthorPhoto(id, token) {
  return fetchData(`blog/authors/${id}/photo`, null, "DELETE", token)
}
