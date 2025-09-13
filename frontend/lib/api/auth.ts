// src/api/auth.ts
import { LoginFormValues } from "@/app/auth/models/loginFormProps";
import { RegistrationFormValues } from "@/app/auth/models/registrationFormProps";
import ApiList from "@/config/api-list";

export async function loginApi(payload: LoginFormValues) {
    try {
        const res = await fetch(ApiList.Login,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            throw new Error("Login failed");
        }
        return res.json();
    } catch(err){
        console.log(err)
    }
}


export async function adminLoginApi(payload: LoginFormValues) {
    try {
        const res = await fetch(ApiList.AdminLogin, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            throw new Error("Login failed");
        }
        return res.json();
    } catch(err){
        console.log(err)
    }
}

export async function signupApi(payload: RegistrationFormValues) {
    const res = await fetch(ApiList.Register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error("Signup failed");
    }
    return res.json();
}
