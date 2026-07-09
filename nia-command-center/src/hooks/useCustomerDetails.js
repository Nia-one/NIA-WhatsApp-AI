import { useQuery } from "@tanstack/react-query";

import {
  getCustomerById,
  getCustomerOrders,
  getCustomerStats,
} from "../services/customerService";

export function useCustomerDetails(customerId) {

  const customer = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomerById(customerId),
    enabled: !!customerId,
  });

  const orders = useQuery({
    queryKey: ["customer-orders", customerId],
    queryFn: () => getCustomerOrders(customerId),
    enabled: !!customerId,
  });

  const stats = useQuery({
    queryKey: ["customer-stats", customerId],
    queryFn: () => getCustomerStats(customerId),
    enabled: !!customerId,
  });

  return {
    customer,
    orders,
    stats,
  };

}