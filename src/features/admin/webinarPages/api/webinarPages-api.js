import { fetchData } from "lib/api"

export const listPages   = (token, search) => fetchData(`webinar-pages${search ? `?search=${encodeURIComponent(search)}` : ""}`, null, "GET", token)
export const getPage     = (id, token)      => fetchData(`webinar-pages/${id}`, null, "GET", token)
export const createPage  = (fd, token)      => fetchData("webinar-pages", fd, "POST", token, true)
export const updatePage  = (id, fd, token)  => fetchData(`webinar-pages/${id}`, fd, "PUT", token, true)
export const deletePage  = (id, token)      => fetchData(`webinar-pages/${id}`, null, "DELETE", token)
export const checkSlug   = (slug, excludeId) => {
  const qs = excludeId ? `?excludeId=${excludeId}` : ""
  return fetchData(`webinar-pages/check-slug/${encodeURIComponent(slug)}${qs}`, null, "GET")
}
