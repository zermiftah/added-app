import { fetchData } from "lib/api"

// ── Categories ──────────────────────────────────────────────
export const getCategories = (token) =>
  fetchData("team/categories", null, "GET", token)

export const createCategory = (data, token) =>
  fetchData("team/categories", data, "POST", token)

export const updateCategory = (id, data, token) =>
  fetchData(`team/categories/${id}`, data, "PUT", token)

export const deleteCategory = (id, token) =>
  fetchData(`team/categories/${id}`, null, "DELETE", token)

export const reorderCategories = (ids, token) =>
  fetchData("team/categories/reorder", { ids }, "POST", token)

// ── Members ─────────────────────────────────────────────────
export const getMembers = (token, categoryId) => {
  const qs = categoryId ? `?categoryId=${categoryId}` : ""
  return fetchData(`team/members${qs}`, null, "GET", token)
}

// fd = FormData (with optional `photo` file)
export const createMember = (fd, token) =>
  fetchData("team/members", fd, "POST", token, true)

export const updateMember = (id, fd, token) =>
  fetchData(`team/members/${id}`, fd, "PUT", token, true)

export const deleteMember = (id, token) =>
  fetchData(`team/members/${id}`, null, "DELETE", token)

export const reorderMembers = (ids, token) =>
  fetchData("team/members/reorder", { ids }, "POST", token)
