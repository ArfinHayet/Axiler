// src/viewModels/authViewModel.ts
import { useMutation } from "@tanstack/react-query";
import { fileUpload, addNewProduct } from "@/lib/api/addProduct";
import { ProductProps } from "@/app/products/models/Products";


// ✅ use the browser's File type (no need to import from "buffer")
export function useAddNewProduct() {
    return useMutation({
        mutationFn: (payload: ProductProps) => addNewProduct(payload),
    });
}

// ✅ use the browser's File type (no need to import from "buffer")
export function useUploadFile() {
    return useMutation({
        mutationFn: (payload: File) => fileUpload(payload),
    });
}


