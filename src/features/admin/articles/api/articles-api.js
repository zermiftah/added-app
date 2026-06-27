import { fetchData, API_BASE_URL } from "lib/api"

/** @param {string} path */
export const thumbUrl = (path) => `${API_BASE_URL}/uploads/${path}`

/**
 * @param {string} token
 * @param {"published"|"draft"|"all"} [status]
 * @param {string} [search]
 */
export async function getArticles(token, status, search) {
  const params = []
  if (status && status !== "all") params.push(`status=${status}`)
  if (search) params.push(`search=${encodeURIComponent(search)}`)
  const qs = params.length ? `?${params.join("&")}` : ""
  return fetchData(`blog/articles${qs}`, null, "GET", token)
}

/** @param {string} token */
export async function getTopics(token) {
  return fetchData("blog/topics", null, "GET", token)
}

/** @param {string} token */
export async function getAuthors(token) {
  return fetchData("blog/authors", null, "GET", token)
}

/**
 * @param {FormData} fd
 * @param {string} token
 * @param {number} [id]
 */
export async function saveArticle(fd, token, id) {
  const path = id ? `blog/articles/${id}` : "blog/articles"
  return fetchData(path, fd, id ? "PUT" : "POST", token, true)
}

/**
 * @param {number} id
 * @param {string} token
 */
export async function deleteArticle(id, token) {
  return fetchData(`blog/articles/${id}`, null, "DELETE", token)
}

/**
 * @param {string} name
 * @param {string} token
 */
export async function addTopic(name, token) {
  return fetchData("blog/topics", { name }, "POST", token)
}

/**
 * @param {number} id
 * @param {string} token
 */
export async function deleteTopic(id, token) {
  return fetchData(`blog/topics/${id}`, null, "DELETE", token)
}
