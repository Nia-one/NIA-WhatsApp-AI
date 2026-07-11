import api from "./api";

export const getCustomers = async (params = {}) => {
  const { data } = await api.get("/customers", {
    params,
  });

  return data.data;
};

export const getCustomerById = async (id) => {
  const { data } = await api.get(`/customers/${id}`);

  return data.data;
};

export const getCustomerOrders = async (id) => {
  const { data } = await api.get(`/customers/${id}/orders`);

  return data.data;
};

export const getCustomerStats = async (id) => {
  const { data } = await api.get(`/customers/${id}/stats`);

  return data.data;
};

// ======================================
// Assign Studio
// ======================================

export const assignStudio = async (
    customerId,
    studioCode
) => {

    const { data } = await api.post(
        `/customers/${customerId}/assign-studio`,
        {
            studio_code: studioCode,
        }
    );

    return data.data;

};