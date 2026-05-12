import { api } from "./apiConfig";

export const authService = {
    login: async (user_id: number, password: string) => {
        const response = await api.post("/auth/login", { user_id, password });
        return response;
    },

    register: async (email: string, phone_number: string, password: string, role: string) => {
        const response = await api.post("/accounts/signup", { email, phone_number, password, role });
        return response;
    },
};
