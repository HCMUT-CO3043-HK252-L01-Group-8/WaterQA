export const ADAFRUIT_FEEDS = {
    TEMP_FEED: "temp",

    HUMIDITY_FEED: "humi",

    LIGHT_FEED: "light",
} as const;


export const THRESHOLDS = {
    TEMP_WARNING: 40,
    HUMIDITY_WARNING: 80,
    LIGHT_NORMAL: 50,
    LIGHT_WARNING: 60,
    LIGHT_CHECK_DURATION_MS: 5000,
} as const;


export const REFRESH_INTERVALS = {
    DASHBOARD_REFRESH_MS: 8000,
    ALERT_THROTTLE_MS: 30000,
} as const;
