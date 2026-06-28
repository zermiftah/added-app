import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAdminStore } from "stores/adminStore"
import * as api from "./team-api"

const KEYS = {
  categories: ["team", "categories"],
  members:    (categoryId) => ["team", "members", categoryId || "all"],
}

// ── Categories ──────────────────────────────────────────────
export function useCategories() {
  const token = useAdminStore(s => s.token)
  return useQuery({
    queryKey: KEYS.categories,
    queryFn:  () => api.getCategories(token).then(r => r.categories || []),
    enabled:  !!token,
  })
}

export function useCreateCategory() {
  const qc    = useQueryClient()
  const token = useAdminStore(s => s.token)
  return useMutation({
    mutationFn: (data) => api.createCategory(data, token),
    onSuccess:  () => qc.invalidateQueries({ queryKey: KEYS.categories }),
  })
}

export function useUpdateCategory() {
  const qc    = useQueryClient()
  const token = useAdminStore(s => s.token)
  return useMutation({
    mutationFn: ({ id, data }) => api.updateCategory(id, data, token),
    onSuccess:  () => qc.invalidateQueries({ queryKey: KEYS.categories }),
  })
}

export function useDeleteCategory() {
  const qc    = useQueryClient()
  const token = useAdminStore(s => s.token)
  return useMutation({
    mutationFn: (id) => api.deleteCategory(id, token),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: KEYS.categories })
      qc.invalidateQueries({ queryKey: ["team", "members"] })
    },
  })
}

export function useReorderCategories() {
  const qc    = useQueryClient()
  const token = useAdminStore(s => s.token)
  return useMutation({
    mutationFn: (ids) => api.reorderCategories(ids, token),
    onSuccess:  () => qc.invalidateQueries({ queryKey: KEYS.categories }),
  })
}

// ── Members ─────────────────────────────────────────────────
export function useMembers(categoryId) {
  const token = useAdminStore(s => s.token)
  return useQuery({
    queryKey: KEYS.members(categoryId),
    queryFn:  () => api.getMembers(token, categoryId).then(r => r.members || []),
    enabled:  !!token,
  })
}

export function useCreateMember() {
  const qc    = useQueryClient()
  const token = useAdminStore(s => s.token)
  return useMutation({
    mutationFn: (fd) => api.createMember(fd, token),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["team", "members"] }),
  })
}

export function useUpdateMember() {
  const qc    = useQueryClient()
  const token = useAdminStore(s => s.token)
  return useMutation({
    mutationFn: ({ id, fd }) => api.updateMember(id, fd, token),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["team", "members"] }),
  })
}

export function useDeleteMember() {
  const qc    = useQueryClient()
  const token = useAdminStore(s => s.token)
  return useMutation({
    mutationFn: (id) => api.deleteMember(id, token),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["team", "members"] }),
  })
}

export function useReorderMembers() {
  const qc    = useQueryClient()
  const token = useAdminStore(s => s.token)
  return useMutation({
    mutationFn: (ids) => api.reorderMembers(ids, token),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["team", "members"] }),
  })
}
