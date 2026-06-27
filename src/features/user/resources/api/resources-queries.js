import { useQuery } from "@tanstack/react-query"
import {
  getPublicArticles, getPublicArticle, getPublicTopics, getTrendingArticles,
} from "./resources-api"

export const usePublicArticlesQuery = (params = {}) =>
  useQuery({
    queryKey: ["public-articles", params],
    queryFn: () => getPublicArticles(params),
    select: (data) => data.articles ?? [],
  })

/** @param {string} slug */
export const usePublicArticleQuery = (slug) =>
  useQuery({
    queryKey: ["public-article", slug],
    queryFn: () => getPublicArticle(slug),
    enabled: !!slug,
    select: (data) => data.article ?? data,
  })

export const usePublicTopicsQuery = () =>
  useQuery({
    queryKey: ["public-topics"],
    queryFn: getPublicTopics,
    select: (data) => data.topics ?? [],
  })

export const useTrendingQuery = (limit = 5) =>
  useQuery({
    queryKey: ["trending", limit],
    queryFn: () => getTrendingArticles(limit),
    select: (data) => data.trending ?? [],
  })
