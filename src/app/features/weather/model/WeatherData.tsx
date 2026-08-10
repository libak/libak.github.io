export interface WeatherData {
    timestamp: string; // ISO 8601 string
    wind: Wind;
    wave: Wave;
}

interface Wind {
    current?: number | null;
    average: number | null;
    gust: number | null;
    direction: number | null;
    temp: number | null;
}

interface Wave {
    max: number | null;
    average: number | null;
    period: number | null;
    direction: number | null;
    temp: number | null;
}
