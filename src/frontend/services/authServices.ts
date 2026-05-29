import api from "./apiConfig";

export const authServices = {
    login: (email: string, password: string, signal?: AbortSignal) => {
        return api.post("/auth/login", { email, password }, { signal });
    },

    signup: (name: string, email: string, phone_number: string, password: string, signal?: AbortSignal) => {
        return api.post("/accounts/signup", { name, email, phone_number, password }, { signal });
    },

    loginWithGoogle: (name: string, email: string, picture: string, signal?: AbortSignal) => {
        return api.post("/auth/google", { name, email, picture }, { signal });
    },

    logout: (signal?: AbortSignal) => {
        return api.delete("/auth/logout", { signal });
    },

    forgotPassword: (email: string, signal?: AbortSignal) => {
        return api.post("/auth/forgot-password", { email }, { signal });
    },

    verifyOTP: (email: string, otp: string, signal?: AbortSignal) => {
        return api.post("/auth/verify-otp", { email, otp }, { signal });
    },

    resetPassword: (email: string, otp: string, new_password: string, signal?: AbortSignal) => {
        return api.post("/auth/reset-password", { email, otp, new_password }, { signal });
    },

    getMe: (signal?: AbortSignal) => {
        return api.get("/accounts/me", { signal });
    },

    updateEmailNotifications: (email_notifications: boolean, signal?: AbortSignal) => {
        return api.put("/accounts/me/email-notifications", { email_notifications }, { signal });
    },
};
