import axios from "axios";

const BASE_URL = "http://localhost:3000";

// eslint-disable-next-line import/no-named-as-default-member
export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => {
        return response.data && response.data.success ? response.data.payload : response;
    },
    (error) => {
        return Promise.reject(error);
    },
);
