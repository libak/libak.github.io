import React from "react";
import {WeatherData} from "@/app/features/weather/model/WeatherData";
import {horizontalPadding} from "@/app/common/styles";
import {COLORS} from "@/app/features/weather/ui/WindChart";
import {getWindArrow} from "@/app/features/weather/ui/WaveChart";

export interface WeatherCurrentProps {
    currentWeather: WeatherData| null;
}

export const WindCurrent: React.FC<WeatherCurrentProps> = ({currentWeather}) => {
    const wind = currentWeather?.wind;
    return (
        <div className={`flex flex-wrap gap-8 ${horizontalPadding}`}>
            <h3>Time: {currentWeather ? (new Date(currentWeather.timestamp).toLocaleTimeString()) : ""}</h3>
            <h3 style={{color: COLORS.MAX}}>Max: {wind?.gust} m/s</h3>
            <h3 style={{color: COLORS.AVERAGE}}>Average: {wind?.average} m/s</h3>
            <h3 className="flex items-center space-x-1">
                <p>{wind?.direction}°</p>
                {getWindArrow(wind?.direction)}
            </h3>
            <h3>{wind?.temp} °C</h3>
        </div>
    );
};