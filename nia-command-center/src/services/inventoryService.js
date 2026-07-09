import api from "./api";

/**
 * Get Inventory List
 */
export const getInventory = async (params = {}) => {
  const { data } = await api.get("/inventory", {
    params,
  });

  return data;
};

/**
 * Get Inventory Details
 */
export const getInventoryById = async (productId) => {
  const { data } = await api.get(`/inventory/${productId}`);

  return data;
};

/**
 * Update Inventory Stock
 */
export const updateInventoryStock = async (productId, payload) => {
  const { data } = await api.patch(
    `/inventory/${productId}`,
    payload
  );

  return data;
};