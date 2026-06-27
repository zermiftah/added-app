import { useMutation } from "@tanstack/react-query"
import { useAdminStore } from "stores/adminStore"
import { loginAdmin } from "./auth-api"

/**
 * Mutation hook for admin login
 * @param {{ onError?: (msg: string) => void }} opts
 */
export function useLoginMutation({ onError } = {}) {
  const setToken = useAdminStore(s => s.setToken)

  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      setToken(data.token)
    },
    onError: (err) => {
      onError?.(err.message || "Login failed")
    },
  })
}
