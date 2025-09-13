"use client";

import { useState, ReactNode, useEffect } from "react";
import ProductTable from "./component/ProductTable";
import OrderTable from "./component/OrderTable";
import { useProductListVm } from "../products/viewmodels/useProductVM";
import { useOrderListVm } from "./orders/useOrderListVM";
import AdminHeader from "@/components/AdminHeader";

interface Tab {
    label: string;
    content: ReactNode;
}


export default function Home() {
    const [activeIndex, setActiveIndex] = useState(0);

    const { products, isLoading, isError, error, refetch } = useProductListVm();
    const { orders } = useOrderListVm();

    const tabData = [
        { label: "Product", content: <ProductTable data={products} /> },
        // @ts-expect-error demo
        { label: "Order", content: <OrderTable data={orders} /> }
    ];


    return (
        <>
            <AdminHeader />
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

                <h1>Dashboard</h1>
                {/* Tab Labels */}
                <div className="flex border-b border-gray-300">
                    {tabData.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-all
                            ${activeIndex === index
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                    {tabData[activeIndex] && <div>{tabData[activeIndex].content}</div>}
                </div>
            </div>
        </>
    );
}
