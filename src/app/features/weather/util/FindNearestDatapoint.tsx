import {WindDataFormatted} from "@/app/features/weather/model/WindData";


export const findNearestDatapoint = (data: WindDataFormatted[], targetTimestamp: string) => {
    const targetTime = new Date(targetTimestamp).getTime();

    // Find the nearest datapoint by calculating the absolute time difference
    return data.reduce((nearest, current) => {
        const currentTime = new Date(current.timestamp).getTime();
        const nearestTime = new Date(nearest.timestamp).getTime();

        return Math.abs(currentTime - targetTime) < Math.abs(nearestTime - targetTime)
            ? current
            : nearest;
    });
};