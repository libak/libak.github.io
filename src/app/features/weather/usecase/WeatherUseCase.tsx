import { WeatherData } from "@/app/features/weather/model/WeatherData";

export const fetchWeatherData = async (): Promise<WeatherData[]> => {
    try {
        const response = await fetch("https://europe-west1-hyden-libak.cloudfunctions.net/getWindData");
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