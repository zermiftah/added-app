import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAdminStore } from "stores/adminStore"
import {
  getAuthors, getAuthorDetail, saveAuthor, deleteAuthor, removeAuthorPhoto,
} from "./authors-api"

const AUTHORS_KEY = "admin-authors"

export const useAuthorsQuery = () => {
  const token = useAdminStore(s => s.token)
  return useQuery({
    queryKey: [AUTHORS_KEY],
    queryFn: () => getAuthors(token),
    enabled: !!token,
    select: (data) => data.authors ?? [],
  })
}

/** @param {number} id */
export const useAuthorDetailQuery = (id) => {
  const token = useAdminStore(s => s.token)
  return useQuery({
    queryKey: [AUTHORS_KEY, id],
    queryFn: () => getAuthorDetail(id, token),
    enabled: !!id && !!token,
  })
}

export const useSaveAuthorMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ fd, id }) => saveAuthor(fd, token, id),
    onSuccess: () => { qc.invalidateQueries([AUTHORS_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}

export const useDeleteAuthorMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteAuthor(id, token),
    onSuccess: () => { qc.invalidateQueries([AUTHORS_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}

export const useRemovePhotoMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => removeAuthorPhoto(id, token),
    onSuccess: () => { qc.invalidateQueries([AUTHORS_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}
