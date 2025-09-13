"use client";

import React from "react";
import { useOrderUpdateVM } from "../orders/useOrderListVM";

interface OrderProduct {
    _id: string;
    productId: string | null;
    productName: string | null;
}

interface Order {
    id: string;
    _id: string;
    name: string;
    address: string;
    phone: string;
    note: string;
    products: OrderProduct[];
    created_at: string;
    processed_at: string;
    status: string;
}

interface OrderTableProps {
    data: Order[];
}

export default function OrderTable({ data }: OrderTableProps) {


    const { updateOrder, isUpdating } = useOrderUpdateVM();
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order ID</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Customer Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Address</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Phone</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Note</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Products</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Created At</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Processed At</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((order, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-700">{order.id}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{order.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{order.address}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{order.phone}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{order.note}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">
                                <ul className="list-disc list-inside">
                                    {order.products.map((p) => (
                                        <li key={p._id}>{p.productName ?? "Unnamed Product"}</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">
                                {new Date(order.created_at).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">
                                {new Date(order.processed_at).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-sm">
                                <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${order.status === "inserted"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">
                                {order.status != "delivered" && <button
                                    onClick={() => updateOrder(order._id)}
                                    disabled={isUpdating}
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    {isUpdating ? "Updating..." : "Deliver Now"}
                                </button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
