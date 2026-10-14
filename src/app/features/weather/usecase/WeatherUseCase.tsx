import { WeatherData } from "@/app/features/weather/model/WeatherData";

const WEATHER_API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL ?? "https://europe-west1-hyden-libak.cloudfunctions.net";

// since: newest timestamp already loaded; omitted on first load to get the full 24h
export const fetchWeatherData = async (since?: string): Promise<WeatherData[]> => {
    try {
        const query = since ? `?since=${encodeURIComponent(since)}` : "";
        const response = await fetch(`${WEATHER_API_URL}/getWindData${query}`);
        const data: WeatherData[] = await response.json();
        return data.map((item: WeatherData) => ({
            ...item,
            timestamp: new Date(item.timestamp).toISOString(), // Ensure ISO format
        }));
    } catch (error) {
        console.error("Error fetching wind data:", error);
        throw error;
    }
};