import ApiList from "@/config/api-list";
import { OrderProps } from "@/app/checkout/models/checkout";
import { RestClient } from "../utils/RestClient";

export const checkoutProduct = async (data : OrderProps): Promise<object> => {
    const response = await RestClient.post(ApiList.Orders,data) as object;
    return response;
};




