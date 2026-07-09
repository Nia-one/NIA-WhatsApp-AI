import { useQuery } from "@tanstack/react-query";

import {
  getDashboardKPIs,
  getSalesTrend,
  getTopProducts,
  getOrderStatusAnalytics,
  getCustomerAnalytics,
  getInventoryAnalytics,
  getStudioAnalytics,
} from "../services/reportsService";

/* ==========================================
   Executive Dashboard
========================================== */

export function useDashboardKPIs(params = {}) {
  return useQuery({
    queryKey: ["reports-dashboard", params],
    queryFn: () => getDashboardKPIs(params),
    refetchInterval: 30000,
  });
}

/* ==========================================
   Sales Trend
========================================== */

export function useSalesTrend(params = {}) {
  return useQuery({
    queryKey: ["sales-trend", params],
    queryFn: () => getSalesTrend(params),
  });
}

/* ==========================================
   Top Products
========================================== */

export function useTopProducts(params = {}) {
  return useQuery({
    queryKey: ["top-products", params],
    queryFn: () => getTopProducts(params),
  });
}

/* ==========================================
   Order Status Analytics
========================================== */

export function useOrderStatusAnalytics(params = {}) {
  return useQuery({
    queryKey: ["order-status", params],
    queryFn: () => getOrderStatusAnalytics(params),
  });
}

/* ==========================================
   Customer Analytics
========================================== */

export function useCustomerAnalytics(params = {}) {
  return useQuery({
    queryKey: ["customer-analytics", params],
    queryFn: () => getCustomerAnalytics(params),
  });
}

/* ==========================================
   Inventory Analytics
========================================== */

export function useInventoryAnalytics(params = {}) {
  return useQuery({
    queryKey: ["inventory-analytics", params],
    queryFn: () => getInventoryAnalytics(params),
  });
}

/* ==========================================
   Studio Analytics
========================================== */

export function useStudioAnalytics(params = {}) {
  return useQuery({
    queryKey: ["studio-analytics", params],
    queryFn: () => getStudioAnalytics(params),
  });
}