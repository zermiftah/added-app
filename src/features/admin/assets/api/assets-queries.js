import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAdminStore } from "stores/adminStore"
import { getAssets, uploadAsset, deleteAsset } from "./assets-api"

export function useAssetsQuery() {
  const token = useAdminStore(s => s.token)
  return useQuery({
    queryKey: ["assets"],
    queryFn: () => getAssets(token),
    select: d => d.assets ?? [],
  })
}

export function useUploadAssetMutation({ onSuccess, onError } = {}) {
  const token = useAdminStore(s => s.token)
  const qc    = useQueryClient()
  return useMutation({
    mutationFn: (file) => uploadAsset(file, token),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["assets"] })
      onSuccess?.(data)
    },
    onError: (err) => onError?.(err.message),
  })
}

export function useDeleteAssetMutation({ onSuccess, onError } = {}) {
  const token = useAdminStore(s => s.token)
  const qc    = useQueryClient()
  return useMutation({
    mutationFn: (filename) => deleteAsset(filename, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets"] })
      onSuccess?.()
    },
    onError: (err) => onError?.(err.message),
  })
}
