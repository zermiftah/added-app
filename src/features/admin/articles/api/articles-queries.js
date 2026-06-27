import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAdminStore } from "stores/adminStore"
import {
  getArticles, getTopics, getAuthors,
  saveArticle, deleteArticle, addTopic, deleteTopic,
} from "./articles-api"

const ARTICLES_KEY = "admin-articles"
const TOPICS_KEY   = "admin-topics"
const AUTHORS_KEY  = "admin-authors-select"

/**
 * @param {"published"|"draft"|"all"} status
 * @param {string} search
 */
export const useArticlesQuery = (status = "all", search = "") => {
  const token = useAdminStore(s => s.token)
  return useQuery({
    queryKey: [ARTICLES_KEY, status, search],
    queryFn: () => getArticles(token, status, search),
    enabled: !!token,
    select: (data) => data.articles ?? [],
  })
}

export const useTopicsQuery = () => {
  const token = useAdminStore(s => s.token)
  return useQuery({
    queryKey: [TOPICS_KEY],
    queryFn: () => getTopics(token),
    enabled: !!token,
    select: (data) => data.topics ?? [],
  })
}

export const useAuthorsSelectQuery = () => {
  const token = useAdminStore(s => s.token)
  return useQuery({
    queryKey: [AUTHORS_KEY],
    queryFn: () => getAuthors(token),
    enabled: !!token,
    select: (data) => data.authors ?? [],
  })
}

export const useSaveArticleMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ fd, id }) => saveArticle(fd, token, id),
    onSuccess: () => { qc.invalidateQueries([ARTICLES_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}

export const useDeleteArticleMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteArticle(id, token),
    onSuccess: () => { qc.invalidateQueries([ARTICLES_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}

export const useAddTopicMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name) => addTopic(name, token),
    onSuccess: () => { qc.invalidateQueries([TOPICS_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}

export const useDeleteTopicMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteTopic(id, token),
    onSuccess: () => { qc.invalidateQueries([TOPICS_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}
