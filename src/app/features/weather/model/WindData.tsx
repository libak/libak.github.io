export interface WindData {
    timestamp: string; // ISO 8601 string
    average: number;   // Average wind speed in m/s
    gust: number;      // Gust wind speed in m/s
}

export interface WindDataFormatted {
    timestamp: string; // ISO 8601 string
    average: number;   // Average wind speed in m/s
    gust: number;      // Gust wind speed in m/s
}