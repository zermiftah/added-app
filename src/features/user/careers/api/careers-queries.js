import { useMutation, useQuery } from "@tanstack/react-query"
import { getPublicJobs, getPublicJob, applyJob } from "./careers-api"

export const usePublicJobsQuery = () =>
  useQuery({
    queryKey: ["public-jobs"],
    queryFn: getPublicJobs,
    select: (data) => data.jobs ?? [],
  })

/** @param {string} id */
export const usePublicJobQuery = (id) =>
  useQuery({
    queryKey: ["public-job", id],
    queryFn: () => getPublicJob(id),
    enabled: !!id,
    select: (data) => data.job ?? data,
  })

export const useApplyJobMutation = ({ onSuccess, onError } = {}) =>
  useMutation({
    mutationFn: applyJob,
    onSuccess,
    onError: (err) => onError?.(err.message),
  })
