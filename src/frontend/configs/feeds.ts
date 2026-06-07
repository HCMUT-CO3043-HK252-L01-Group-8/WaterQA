export const ADAFRUIT_FEEDS = {
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
    PH_WARNING_LOW: 6.5,
    PH_WARNING_HIGH: 8.5,
    HARDNESS_WARNING: 300,
} as const;


export const REFRESH_INTERVALS = {
    DASHBOARD_REFRESH_MS: 8000,
    ALERT_THROTTLE_MS: 30000,
} as const;
