import React from "react";
import {horizontalPadding} from "@/app/common/styles";
import {WeatherCurrentProps} from "@/app/features/weather/ui/WindCurrent";
import {COLORS} from "@/app/features/weather/ui/WindChart";
import {getWindArrow} from "@/app/features/weather/ui/WaveChart";

export const WaveCurrent: React.FC<WeatherCurrentProps> = ({currentWeather}) => {
    const wave = currentWeather?.wave;
    return (
        <div className={`flex flex-wrap gap-8 ${horizontalPadding}`}>
            <h3><b>Waves</b></h3>
            <h3 style={{color: COLORS.MAX}}>Max: {wave?.max} m/s</h3>
            <h3 style={{color: COLORS.AVERAGE}}>Average: {wave?.average} m/s</h3>
            <h3 className="flex items-center space-x-1">
                <p>{wave?.direction}°</p>
                {getWindArrow(wave?.direction)}
            </h3>
            <h3>{wave?.period} sec</h3>
            <h3>{wave?.temp} °C</h3>
        </div>
    );
};