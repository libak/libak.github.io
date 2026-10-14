import {WeatherData} from "@/app/features/weather/model/WeatherData";

const DAY_MS = 24 * 60 * 60 * 1000;

// Dedupes by timestamp so a full 24h response (e.g. from Firebase, which ignores ?since) merges safely
export const mergeLast24h = (existing: WeatherData[], incoming: WeatherData[]): WeatherData[] => {
    const byTimestamp = new Map([...existing, ...incoming].map((entry) => [entry.timestamp, entry]));
    const merged = [...byTimestamp.values()].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const cutoff = new Date(merged[merged.length - 1]?.timestamp ?? 0).getTime() - DAY_MS;
    return merged.filter((entry) => new Date(entry.timestamp).getTime() > cutoff);
};
