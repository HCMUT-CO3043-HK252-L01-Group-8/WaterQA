import api from "./apiConfig";
import { ApiResponse } from "./authServices";

export const aiServices = {
    predictPotability: (data: {
        ph: number;
        Hardness: number;
        Solids: number;
        Chloramines: number;
        Sulfate: number;
        Conductivity: number;
        Organic_carbon: number;
        Trihalomethanes: number;
        Turbidity: number;
    }, signal?: AbortSignal) => {
        return api.post<any, any>("/model/predict-potability", data, {
            signal,
        });
    }
};
