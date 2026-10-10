import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {WeatherCurrentProps} from "@/app/features/weather/ui/WindCurrent";

const WAVE_COLOR = '#0649c2';
const WIND_COLOR = '#505050';
const MAP_WIDTH = 1300;
const MAP_HEIGHT = 1620;
const CELL_TARGET_PX = 100;

const Arrow: React.FC<{ direction: number; color: string; size: number; opacity?: number }> = ({direction, color, size, opacity}) => (
    <span className="material-icons" style={{
        fontSize: `${size}px`,
        color,
        opacity,
        transform: `rotate(${direction + 180}deg)`,
    }}>north</span>
);

export const WindWaveMap: React.FC<WeatherCurrentProps> = ({currentWeather}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    const columns = Math.min(7, Math.max(3, Math.round(width / CELL_TARGET_PX)));
    const rows = Math.round(columns * MAP_HEIGHT / MAP_WIDTH);
    // Each cell holds a wind arrow in its upper half and a wave arrow in its lower half
    const arrowSize = Math.min(34, width / columns * 0.35);
    const windDirection = currentWeather.wind.direction;
    const waveDirection = currentWeather.wave.direction;

    const arrows = (direction: number, color: string, opacity: number, rowOffset: number) =>
        Array.from({length: columns * rows}).map((_, index) => (
            <div
                key={index}
                className="absolute"
                style={{
                    top: `${(Math.floor(index / columns) + rowOffset) / rows * 100}%`,
                    left: `${(index % columns + 0.5) / columns * 100}%`,
                    transform: "translate(-50%, -50%)",
                    lineHeight: 0,
                }}
            >
                <Arrow direction={direction} color={color} size={arrowSize} opacity={opacity}/>
            </div>
        ));

    return (
        <div className="max-w-[700px]">
            <div ref={containerRef} className="relative overflow-hidden">
                <Image
                    src="/assets/images/hvide-sande-map.png"
                    alt="Hvide Sande air map"
                    width={MAP_WIDTH}
                    height={MAP_HEIGHT}
                    className="w-full h-auto"
                />
                {width > 0 && windDirection !== null && arrows(windDirection, WIND_COLOR, 0.5, 0.3)}
                {width > 0 && waveDirection !== null && arrows(waveDirection, WAVE_COLOR, 0.2, 0.7)}
            </div>
            <div className="flex justify-center items-center gap-4 pt-2">
                {windDirection !== null && (
                    <div className="flex gap-1">
                        <Arrow direction={windDirection} color={WIND_COLOR} size={24}/>
                        <p style={{color: WIND_COLOR}}>Wind</p>
                    </div>
                )}
                {waveDirection !== null && (
                    <div className="flex gap-1">
                        <Arrow direction={waveDirection} color={WAVE_COLOR} size={24}/>
                        <p style={{color: WAVE_COLOR}}>Waves</p>
                    </div>
                )}
            </div>
        </div>
    );
};
