import ApiList from "@/config/api-list";
import { ProductProps, ProductResponse, ProductListResponse } from "@/app/products/models/Products";

import { RestClient } from "../utils/RestClient";

export type OrderProduct = {
  _id: string;
  productId: string | null;
  productName: string | null;
};

export type Order = {
  order_id: string;
  name: string;
  address: string;
  phone: string;
  note: string;
  products: OrderProduct[];
  created_at: string;   // ISO date string
  processed_at: string; // ISO date string
  status: "inserted" | "pending" | "shipped" | "delivered" | "cancelled"; // extend as needed
};


type orderApiResponse = {
    data : {
        data : Order[]
    }
}

export const getProducts = async (): Promise<ProductProps[]> => {
    const response = await RestClient.get<ProductResponse>(ApiList.Products);
    return response.data.data
};


export const getSingleProduct = async (id : string): Promise<ProductProps[]> => {
    const response = await RestClient.get<ProductListResponse>(ApiList.Product+id);
    return response.data.product
};


export const getAllOrder = async (): Promise<Order[]> => {
    const response = await RestClient.get<orderApiResponse>(ApiList.Orders);
    return response.data.data;
};


export const updateOrder = async (id: string): Promise<Order[]> => {
    const payload = {
        status : 'delivered'
    }
    const response = await RestClient.put<orderApiResponse>(ApiList.Orders+id,payload);
    return response.data.data;
};
