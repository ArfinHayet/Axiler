"use client";

import ProductListView from "@/components/ProductListView";
import { useProductListVm } from "./viewmodels/useProductVM";
import Header from "@/components/Header";
export default function Product() {
    const { products, isLoading, isError, error, refetch } = useProductListVm();
    return (
        <>
          {products && <ProductListView products={products}/>}
        </>
    );
}