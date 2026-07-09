import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../services/dashboardService";

export function useOrders(params = {}) {
  const queryClient = useQueryClient();

  // Orders List
  const ordersQuery = useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    keepPreviousData: true,
  });

  // Order Details
  const orderDetailsMutation = useMutation({
    mutationFn: getOrderById,
  });

  // Update Order Status
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) =>
      updateOrderStatus(orderId, status),

    onSuccess: () => {
      // Refresh Orders List automatically
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });

  return {
    // Orders Query
    ...ordersQuery,

    // Order Details
    getOrderDetails: orderDetailsMutation.mutateAsync,
    selectedOrder: orderDetailsMutation.data,
    isLoadingOrder: orderDetailsMutation.isPending,

    // Status Update
    updateOrderStatus:
      updateOrderStatusMutation.mutateAsync,

    isUpdatingStatus:
      updateOrderStatusMutation.isPending,
  };
}