import { fetchData, API_BASE_URL } from "lib/api"

/** @param {string} path */
export const thumbUrl = (path) => `${API_BASE_URL}/uploads/${path}`

/**
 * @param {{ topic?: string, search?: string, limit?: number, page?: number }} [params]
 */
export async function getPublicArticles(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => { if (v) qs.set(k, v) })
  const str = qs.toString()
  return fetchData(`blog/public/articles${str ? `?${str}` : ""}`, null, "GET")
}

/** @param {string} slug */
export async function getPublicArticle(slug) {
  return fetchData(`blog/public/articles/${slug}`, null, "GET")
}

export async function getPublicTopics() {
  return fetchData("blog/topics", null, "GET")
}

export async function getTrendingArticles(limit = 5) {
  return fetchData(`blog/public/trending?limit=${limit}`, null, "GET")
}
