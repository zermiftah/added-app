import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAdminStore } from "stores/adminStore"
import {
  getJobs, getDepartments, saveJob,
  deleteJob, removeThumbnail, addDepartment, deleteDepartment,
} from "./jobs-api"

const JOBS_KEY = "admin-jobs"
const DEPTS_KEY = "admin-departments"

export const useJobsQuery = (status = "all") => {
  const token = useAdminStore(s => s.token)
  return useQuery({
    queryKey: [JOBS_KEY, status],
    queryFn: () => getJobs(token, status),
    enabled: !!token,
    select: (data) => data.jobs ?? [],
  })
}

export const useDepartmentsQuery = () => {
  const token = useAdminStore(s => s.token)
  return useQuery({
    queryKey: [DEPTS_KEY],
    queryFn: () => getDepartments(token),
    enabled: !!token,
    select: (data) => data.departments ?? [],
  })
}

export const useSaveJobMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ fd, id }) => saveJob(fd, token, id),
    onSuccess: () => { qc.invalidateQueries([JOBS_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}

export const useDeleteJobMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteJob(id, token),
    onSuccess: () => { qc.invalidateQueries([JOBS_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}

export const useRemoveThumbnailMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => removeThumbnail(id, token),
    onSuccess: () => { qc.invalidateQueries([JOBS_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}

export const useAddDepartmentMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name) => addDepartment(name, token),
    onSuccess: () => { qc.invalidateQueries([DEPTS_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}

export const useDeleteDepartmentMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteDepartment(id, token),
    onSuccess: () => { qc.invalidateQueries([DEPTS_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}
