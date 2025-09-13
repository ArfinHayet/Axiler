import { useQuery } from "@tanstack/react-query";
import { ProductProps } from "@/app/products/models/Products";
import { getAllOrder, Order, updateOrder } from "@/lib/api/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// VM for product list
export const useOrderListVm = () => {
    const query = useQuery<object[], Error>({
        queryKey: ["orders"],
        queryFn: getAllOrder,
    });

    return {
        orders: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
};


export function useOrderUpdateVM() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: string) => updateOrder(id),
        onSuccess: (updatedOrders: Order[]) => {
            // ✅ Invalidate and refetch order list
            queryClient.invalidateQueries({ queryKey: ["orders"] });

            // Optionally update cache directly
            queryClient.setQueryData<Order[]>(["orders"], updatedOrders);
        },
        onError: (error) => {
            console.error("Failed to update order:", error);
        },
    });

    return {
        updateOrder: mutation.mutate, // call this in components
        updateOrderAsync: mutation.mutateAsync, // async/await version
        isUpdating: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
}
