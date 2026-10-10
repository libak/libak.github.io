import {Tide} from "@/app/features/weather/model/Tide";
import tides from "@/app/features/weather/data/tides-hvide-sande.json";

export interface TidePoint {
    time: number; // Epoch millis
    height: number;
}

const STEP_MS = 10 * 60 * 1000;

// Tide tables only list high and low water; the curve between them is approximated with a half cosine.
export const listTideCurve = (start: Date, end: Date): TidePoint[] => {
    const extremes = (tides as Tide[]).map((t) => ({time: new Date(t.time).getTime(), height: t.height}));
    const points: TidePoint[] = [];
    for (let time = start.getTime(); time <= end.getTime(); time += STEP_MS) {
        const nextIndex = extremes.findIndex((e) => e.time > time);
        if (nextIndex < 1) continue;
        const previous = extremes[nextIndex - 1];
        const next = extremes[nextIndex];
        const fraction = (time - previous.time) / (next.time - previous.time);
        const height = previous.height + (next.height - previous.height) * (1 - Math.cos(Math.PI * fraction)) / 2;
        points.push({time, height: Math.round(height * 100) / 100});
    }
    return points;
};
