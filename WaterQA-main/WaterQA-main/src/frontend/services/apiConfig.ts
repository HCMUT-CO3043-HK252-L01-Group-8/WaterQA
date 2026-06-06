import axios from "axios";
import Constants from "expo-constants";

const API_PORT = "3000";
const LOCAL_BASE_URL = `http://localhost:${API_PORT}`;

function getExpoDevServerBaseUrl(): string | null {
    const hostUri =
        Constants.expoConfig?.hostUri ||
        (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
        (Constants as any).manifest?.debuggerHost;

    if (typeof hostUri !== "string" || hostUri.length === 0) return null;
    const host = hostUri.split(":")[0];
    return host ? `http://${host}:${API_PORT}` : null;
}

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
export const BASE_URL = (configuredBaseUrl || getExpoDevServerBaseUrl() || LOCAL_BASE_URL).replace(/\/+$/, "");

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            console.error("Phiên đăng nhập hết hạn hoặc chưa đăng nhập!");
        }
        return Promise.reject(error.response?.data || error);
    }
);

export default api;