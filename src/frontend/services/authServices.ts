import api from "./apiConfig";
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    error?: string;
    payload?: T;
}

export const authServices = {
    login: (email: string, password: string, signal?: AbortSignal) => {
        return api.post<any, ApiResponse>("/auth/login", { email, password }, { signal });
    },

    signup: (name: string, email: string, phone_number: string, password: string, signal?: AbortSignal) => {
        return api.post<any, ApiResponse>("/accounts/signup", { name, email, phone_number, password }, { signal });
    },

    loginWithGoogle: (name: string, email: string, picture: string, signal?: AbortSignal) => {
        return api.post<any, ApiResponse>("/auth/google", { name, email, picture }, { signal });
    },

    logout: (signal?: AbortSignal) => {
        return api.delete<any, ApiResponse>("/auth/logout", { signal });
    },

    forgotPassword: (email: string, signal?: AbortSignal) => {
        return api.post<any, ApiResponse>("/auth/forgot-password", { email }, { signal });
    },

    verifyOTP: (email: string, otp: string, signal?: AbortSignal) => {
        return api.post<any, ApiResponse>("/auth/verify-otp", { email, otp }, { signal });
    },

    resetPassword: (email: string, otp: string, new_password: string, signal?: AbortSignal) => {
        return api.post<any, ApiResponse>("/auth/reset-password", { email, otp, new_password }, { signal });
    },

    getMe: (signal?: AbortSignal) => {
        return api.get<any, ApiResponse<{ user_id: number; name: string; email: string; phone_number: string; email_notifications: boolean }>>("/accounts/me", { signal });
    },

    updateEmailNotifications: (email_notifications: boolean, signal?: AbortSignal) => {
        return api.put<any, ApiResponse>("/accounts/me/email-notifications", { email_notifications }, { signal });
    },
};