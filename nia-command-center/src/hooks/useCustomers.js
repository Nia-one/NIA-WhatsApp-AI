import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../services/customerService";

export function useCustomers(params = {}) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => getCustomers(params),

    // Keep previous data while filters/search change
    placeholderData: (previousData) => previousData,

    // Cache for 5 minutes
    staleTime: 1000 * 60 * 5,

    // Don't refetch every time user switches tabs
    refetchOnWindowFocus: false,
  });
}