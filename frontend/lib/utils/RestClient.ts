// RestClient.ts
import { useLocalStorage } from "./useLocalStorage";
import { useRouter } from "next/navigation";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export class RestClient {


    private static router: ReturnType<typeof useRouter> | null = null;

    static setRouter(router: ReturnType<typeof useRouter>) {
        this.router = router;
    }

    private static getHeaders(
        extraHeaders?: Record<string, string>,
        isFormData: boolean = false
    ): Record<string, string> {
        const token = useLocalStorage.getItem<string>("adminToken") || useLocalStorage.getItem<string>("token");
        const domainReference = useLocalStorage.getItem<string>("domain_reference");

        const baseHeaders: Record<string, string> = {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(domainReference ? { domain_reference: domainReference } : {}),
            ...extraHeaders,
        };

        // ❌ Do not set Content-Type manually if FormData
        if (!isFormData) {
            baseHeaders["Content-Type"] = "application/json";
        }

        return baseHeaders;
    }

    private static async request<TResponse, TBody = unknown>(
        url: string,
        method: HttpMethod,
        body?: TBody,
        extraHeaders?: Record<string, string>
    ): Promise<TResponse> {
        const isFormData = body instanceof FormData;

        const options: RequestInit = {
            method,
            headers: this.getHeaders(extraHeaders, isFormData),
        };

        if (body && method !== "GET") {
            options.body = isFormData ? (body as FormData) : JSON.stringify(body);
        }

        const response = await fetch(url, options);

        // 🔹 Handle 401: clear tokens
        if (response.status === 401) {
            useLocalStorage.removeItem("token");
            useLocalStorage.removeItem("adminToken");

            if (this.router) {
                this.router.push("/admin/login");
            } else {
                window.location.href = "/admin/login";
            }
            
            // optional: force logout / redirect
            // window.location.href = "/login";

            throw new Error("Unauthorized - tokens cleared");
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Request failed with status ${response.status}: ${errorText}`
            );
        }

        if (response.status === 204) {
            return {} as TResponse;
        }

        return (await response.json()) as TResponse;
    }

    static get<TResponse>(url: string, extraHeaders?: Record<string, string>) {
        return this.request<TResponse>(url, "GET", undefined, extraHeaders);
    }

    static post<TResponse, TBody = unknown>(
        url: string,
        body: TBody,
        extraHeaders?: Record<string, string>
    ) {
        return this.request<TResponse, TBody>(url, "POST", body, extraHeaders);
    }

    static put<TResponse, TBody = unknown>(
        url: string,
        body: TBody,
        extraHeaders?: Record<string, string>
    ) {
        return this.request<TResponse, TBody>(url, "PUT", body, extraHeaders);
    }

    static delete<TResponse>(url: string, extraHeaders?: Record<string, string>) {
        return this.request<TResponse>(url, "DELETE", undefined, extraHeaders);
    }
}
