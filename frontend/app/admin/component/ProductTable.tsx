"use client";

import { ProductProps } from "@/app/products/models/Products";
import React from "react";

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

interface ProductTableProps {
    data: Product[];
}

export default function ProductTable({ data }: { data: ProductProps[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Image</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Created At</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Updated At</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2">
                                <img
                                    src={process.env.NEXT_PUBLIC_API_URL + 'uploads/'+ item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded"
                                />

                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">{item.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{item.category}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">${item.price}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{item.description}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
