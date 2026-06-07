import api from "./apiConfig";
import { ADAFRUIT_FEEDS } from "@/configs/feeds";
import { ApiResponse } from "./authServices";

export type LatestTelemetryValue = { feedKey: string; value: string | null; createdAt?: string; raw?: unknown };
export type TelemetrySnapshot = {
    ph: LatestTelemetryValue;
    hardness: LatestTelemetryValue;
    solids: LatestTelemetryValue;
    chloramines: LatestTelemetryValue;
    sulfate: LatestTelemetryValue;
    conductivity: LatestTelemetryValue;
    organic_carbon: LatestTelemetryValue;
    trihalomethanes: LatestTelemetryValue;
    turbidity: LatestTelemetryValue;
    fetchedAt: string;
};

const extractLatestValue = (feedKey: string, items: any[]): LatestTelemetryValue => {
    const first = items?.[0];
    return {
        feedKey,
        value: first?.value ? String(first.value) : null,
        createdAt: first?.created_at ? String(first.created_at) : undefined,
        raw: first,
    };
};

export const telemetryServices = {
    getTelemetry: async (feedKey: string, rowLimit: number = 1, signal?: AbortSignal) => {
        const response: any = await api.get(`/data/telemetry`, {
            params: { feedKey, rowLimit },
            signal,
        });

        if (!response.success) throw new Error(response.error || "Lỗi tải telemetry");
        return { payload: response.payload, timestamp: response.timestamp };
    },

    getLatestValue: async (feedKey: string, signal?: AbortSignal): Promise<LatestTelemetryValue> => {
        const { payload } = await telemetryServices.getTelemetry(feedKey, 1, signal);
        return extractLatestValue(feedKey, payload.data);
    },

    getLatestTelemetrySnapshot: async (signal?: AbortSignal): Promise<TelemetrySnapshot> => {
        const [
            ph, hardness, solids, 
            chloramines, sulfate, conductivity, organic_carbon, 
            trihalomethanes, turbidity
        ] = await Promise.all([
            telemetryServices.getLatestValue(ADAFRUIT_FEEDS.PH_FEED, signal),
            telemetryServices.getLatestValue(ADAFRUIT_FEEDS.HARDNESS_FEED, signal),
            telemetryServices.getLatestValue(ADAFRUIT_FEEDS.SOLIDS_FEED, signal),
            telemetryServices.getLatestValue(ADAFRUIT_FEEDS.CHLORAMINES_FEED, signal),
            telemetryServices.getLatestValue(ADAFRUIT_FEEDS.SULFATE_FEED, signal),
            telemetryServices.getLatestValue(ADAFRUIT_FEEDS.CONDUCTIVITY_FEED, signal),
            telemetryServices.getLatestValue(ADAFRUIT_FEEDS.ORGANIC_CARBON_FEED, signal),
            telemetryServices.getLatestValue(ADAFRUIT_FEEDS.TRIHALOMETHANES_FEED, signal),
            telemetryServices.getLatestValue(ADAFRUIT_FEEDS.TURBIDITY_FEED, signal),
        ]);

        return {
            ph,
            hardness,
            solids,
            chloramines,
            sulfate,
            conductivity,
            organic_carbon,
            trihalomethanes,
            turbidity,
            fetchedAt: new Date().toISOString(),
        };
    },

    sendTelemetry: (data: { stationName: string; temperature: number; humidity: number }, signal?: AbortSignal) => {
        return api.post<any, ApiResponse>("/data/telemetry", data, { signal });
    },
};