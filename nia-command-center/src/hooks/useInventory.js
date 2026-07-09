import { useQuery } from "@tanstack/react-query";

import {
  getInventorySummary,
  getInventory,
  getLowStockProducts,
  getOutOfStockProducts,
} from "../services/dashboardService";

export function useInventory(params = {}) {
  // Inventory Summary
  const summaryQuery = useQuery({
    queryKey: ["inventory-summary"],
    queryFn: getInventorySummary,
  });

  // Inventory List
  const inventoryQuery = useQuery({
    queryKey: ["inventory", params],
    queryFn: () => getInventory(params),
    keepPreviousData: true,
  });

  // Low Stock
  const lowStockQuery = useQuery({
    queryKey: ["inventory-low-stock"],
    queryFn: getLowStockProducts,
  });

  // Out of Stock
  const outOfStockQuery = useQuery({
    queryKey: ["inventory-out-of-stock"],
    queryFn: getOutOfStockProducts,
  });

  return {
    summary: summaryQuery.data,
    inventory: inventoryQuery.data,

    lowStockProducts: lowStockQuery.data,
    outOfStockProducts: outOfStockQuery.data,

    isLoading:
      summaryQuery.isPending ||
      inventoryQuery.isPending,

    error:
      summaryQuery.error ||
      inventoryQuery.error,
  };
}