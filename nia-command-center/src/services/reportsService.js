import api from "./api";

/* ==========================================
   Executive Dashboard
========================================== */

export async function getDashboardKPIs() {
  const { data } = await api.get("/reports/dashboard");
  return data.data;
}

/* ==========================================
   Sales Trend
========================================== */

export async function getSalesTrend() {
  const { data } = await api.get("/reports/sales-trend");
  return data.data;
}

/* ==========================================
   Top Products
========================================== */

export async function getTopProducts() {
  const { data } = await api.get("/reports/top-products");
  return data.data;
}

/* ==========================================
   Order Status Analytics
========================================== */

export async function getOrderStatusAnalytics() {
  const { data } = await api.get("/reports/order-status");
  return data.data;
}

/* ==========================================
   Customer Analytics
========================================== */

export async function getCustomerAnalytics() {
  const { data } = await api.get("/reports/customer-analytics");
  return data.data;
}

/* ==========================================
   Inventory Analytics
========================================== */

export async function getInventoryAnalytics() {
  const { data } = await api.get("/reports/inventory-analytics");
  return data.data;
}

/* ==========================================
   Studio Analytics
========================================== */

export async function getStudioAnalytics() {
  const { data } = await api.get("/reports/studio-analytics");
  return data.data;
}