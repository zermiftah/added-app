import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAdminStore } from "stores/adminStore"
import {
  getApplications, updateApplicationStatus, exportApplicationsExcel,
} from "./applicants-api"

const APPS_KEY = "admin-applications"

/**
 * @param {import("./applicants-types").ApplicationFilter} filter
 */
export const useApplicationsQuery = (filter = {}) => {
  const token = useAdminStore(s => s.token)
  return useQuery({
    queryKey: [APPS_KEY, filter],
    queryFn: () => getApplications(filter, token),
    enabled: !!token,
    select: (data) => data.applications ?? [],
  })
}

export const useUpdateStatusMutation = ({ onSuccess, onError } = {}) => {
  const token = useAdminStore(s => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateApplicationStatus(id, data, token),
    onSuccess: () => { qc.invalidateQueries([APPS_KEY]); onSuccess?.() },
    onError: (err) => onError?.(err.message),
  })
}

export const useExportExcelMutation = ({ onError } = {}) => {
  const token = useAdminStore(s => s.token)
  return useMutation({
    mutationFn: (filter) => exportApplicationsExcel(filter, token),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `applicants_${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    },
    onError: (err) => onError?.(err.message),
  })
}
