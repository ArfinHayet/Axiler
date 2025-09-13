import ApiList from "@/config/api-list";
import { RestClient } from "../utils/RestClient";
import { fileUploadResponse } from "@/app/admin/product/models/fileUploadResponse";
import { ProductProps } from "@/app/products/models/Products";
import { ProductResponse } from "@/app/products/models/Products";

export const fileUpload = async (data: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", data);

    // ✅ send formData, not data
    const response = await RestClient.post<fileUploadResponse>(ApiList.Files, formData);
    return response.data.filename;
};


export const addNewProduct = async(data : ProductProps): Promise<ProductProps[]> => {
    // ✅ send formData, not data
    const response = await RestClient.post<ProductResponse>(ApiList.Products, data);
    return response.data.data;
}
