export type RegistrationFormValues = {
    name: string;
    email: string;
    password: string;
};

export interface RegistrationResponseProps {
    flag: boolean;
    code: number;
    message: string;
    data: {
        access_token: string;
        token_type: string;
        expires_in: number;
        user: {
            user: string;
            email: string;
            contact: string;
        };
    };
}


