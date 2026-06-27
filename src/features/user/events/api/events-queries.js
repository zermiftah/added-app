import { useQuery } from "@tanstack/react-query"
import { getPublicEvents } from "./events-api"

export const usePublicEventsQuery = () =>
  useQuery({
    queryKey: ["public-events"],
    queryFn: getPublicEvents,
    select: (data) => data.events ?? data ?? [],
  })
