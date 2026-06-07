export const ADAFRUIT_FEEDS = {
    TEMP_FEED: "temp",
    HUMIDITY_FEED: "humi",
    LIGHT_FEED: "light",
    PH_FEED: "ph",
    HARDNESS_FEED: "hardness",
    SOLIDS_FEED: "solids",
    CHLORAMINES_FEED: "chloramines",
    SULFATE_FEED: "sulfate",
    CONDUCTIVITY_FEED: "conductivity",
    ORGANIC_CARBON_FEED: "organic-carbon",
    TRIHALOMETHANES_FEED: "trihalomethanes",
    TURBIDITY_FEED: "turbidity"
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
