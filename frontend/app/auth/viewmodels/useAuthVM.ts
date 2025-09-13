// src/viewModels/authViewModel.ts
import { useMutation } from "@tanstack/react-query";

import { loginApi, signupApi, adminLoginApi } from "@/lib/api/auth";

import { LoginFormValues } from "../models/loginFormProps";
import { RegistrationFormValues } from "../models/registrationFormProps";

export function useLogin() {
    return useMutation({
        mutationFn: (payload: LoginFormValues) => loginApi(payload),
    });
}

export function useAdminLogin() {
    return useMutation({
        mutationFn: (payload: LoginFormValues) => loginApi(payload),
    });
}

export function useSignup() {
    return useMutation({
        mutationFn: (payload: RegistrationFormValues) => signupApi(payload),
        onSuccess: (data) => {
            console.log("✅ Signup success:", data);
        },
        onError: (error: unknown) => {
            console.error("❌ Signup failed:", error);
        },
    });
}
