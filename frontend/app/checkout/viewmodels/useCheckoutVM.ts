// src/viewModels/authViewModel.ts
import { useMutation } from "@tanstack/react-query";

import { checkoutProduct } from "@/lib/api/checkout";
import { OrderProps } from "../models/checkout";


export function useCheckout() {
    return useMutation({
        mutationFn: (payload: OrderProps) => checkoutProduct(payload),
    });
}