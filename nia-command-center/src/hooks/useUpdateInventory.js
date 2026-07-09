import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateInventoryStock } from "../services/inventoryService";

export default function useUpdateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }) =>
      updateInventoryStock(productId, payload),

    onSuccess: async (_, variables) => {
      // Refresh Inventory List
      await queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });

      await queryClient.refetchQueries({
        queryKey: ["inventory"],
      });

      // Refresh Dashboard Summary
      await queryClient.invalidateQueries({
        queryKey: ["inventory-summary"],
      });

      // Refresh Product Details
      await queryClient.invalidateQueries({
        queryKey: ["inventory-details", variables.productId],
      });

      toast.success("Stock updated successfully");
    },

    onError: (error) => {
      console.error(error);
      toast.error("Failed to update stock");
    },
  });
}