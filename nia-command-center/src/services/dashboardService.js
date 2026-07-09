import api from "./api";

/* Dashboard */

export async function getDashboardSummary() {
  const response = await api.get("/admin/dashboard");
  return response.data.data;
}

/* Orders List */

export async function getOrders(params = {}) {
  const { data } = await api.get("/orders", {
    params,
  });

  return data;
}

/* Single Order */

export async function getOrderById(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
}

/* Update Order Status */

export async function updateOrderStatus(orderId, status) {
  const { data } = await api.patch(
    `/orders/${orderId}/status`,
    {
      status,
    }
  );

  return data.data;
}

/* ==========================================
   INVENTORY
========================================== */

export async function getInventorySummary() {
  const { data } = await api.get("/inventory/summary");
  return data.data;
}

export async function getInventory(params = {}) {
  const { data } = await api.get("/inventory", {
    params,
  });

  return data;
}

export async function getLowStockProducts() {
  const { data } = await api.get("/inventory/low-stock");
  return data.data;
}

export async function getOutOfStockProducts() {
  const { data } = await api.get("/inventory/out-of-stock");
  return data.data;
}