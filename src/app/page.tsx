"use client"; // Mark this as a client component

import Image from "next/image";
import {WindChart} from "@/app/features/weather/ui/WindChart";
import {horizontalPadding} from "@/app/common/styles";
import React, {useEffect, useState} from "react";
import {WeatherData} from "@/app/features/weather/model/WeatherData";
import {fetchWeatherData} from "@/app/features/weather/usecase/WeatherUseCase";
import {addHours, startOfHour} from "date-fns";
import {findNearestDatapoint} from "@/app/features/weather/util/FindNearestDatapoint";
import {WaveChart} from "@/app/features/weather/ui/WaveChart";
import {WindCurrent} from "@/app/features/weather/ui/WindCurrent";
import {WaveCurrent} from "@/app/features/weather/ui/WaveCurrent";

export default function Home() {
    const [chartData, setChartData] = useState<WeatherData[] | null>(null);
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
    // const [lastFetchedTime, setLastFetchedTime] = useState<Date | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            // setLastFetchedTime(new Date());

            try {
                const data = await fetchWeatherData();
                setChartData(data);
                setCurrentWeather(data[data.length - 1]);
            } catch (error) {
                console.error("Error fetching wind data:", error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Generate hourly ticks between the start and end of your data
    const generateHourlyTicks = (start: Date, end: Date) => {
        const ticks: string[] = [];
        let current = startOfHour(start);
        while (current <= end) {
            ticks.push(current.toISOString()); // ISO format
            current = addHours(current, 1); // Move to the next hour
        }
        return ticks;
    };

    // Find the range of your data for tick generation
    let xAxisTicks: string[] | null = null;
    if (chartData) {
        // Find the range of your data for tick generation
        const startTime = new Date(chartData[0].timestamp);
        const endTime = new Date(chartData[chartData.length - 1].timestamp);
        const hourlyTicks = generateHourlyTicks(startTime, endTime);

        xAxisTicks = hourlyTicks.map((tick) => {
            const nearest = findNearestDatapoint(chartData, tick);
            return nearest.timestamp;
        });
    }

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen py-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
            <main
                className="flex flex-col gap-8 row-start-2 w-full font-[family-name:var(--font-geist-mono)]">
                <div
                    className={`flex justify-center items-center sm:items-start sm:justify-start ${horizontalPadding}`}>
                    <Image
                        src="/assets/images/libakit-logo.png"
                        alt="Libak IT ApS logo"
                        width={180}
                        height={38}
                        priority
                    />
                </div>
                <h2 className={`text-left ${horizontalPadding}`}>
                    Hvide Sande {currentWeather ? (new Date(currentWeather.timestamp).toLocaleTimeString()) : ""}
                </h2>
                {chartData ? (
                    <div className={`flex flex-col gap-8`}>
                        <WindCurrent currentWeather={currentWeather}/>
                        <div className="w-full">
                            {chartData && xAxisTicks ?
                                <WindChart chartData={chartData} xAxisTicks={xAxisTicks}/> :
                                <p>Loading</p>
                            }
                        </div>
                        <br/>
                        <WaveCurrent currentWeather={currentWeather}/>
                        <div className="w-full">
                            {chartData && xAxisTicks ?
                                <WaveChart chartData={chartData} xAxisTicks={xAxisTicks}/> :
                                <p>Loading</p>}
                        </div>
                        <br /><br />
                        <div className={`inline-block ${horizontalPadding}`}>
                            <Image
                                src="/assets/images/hvide-sande-map.png"
                                alt="Hvide Sande air map"
                                width={700}
                                height={80}
                            />
                        </div>

                    </div>
                ) : (
                    <p className={horizontalPadding}>
                        Loading...
                    </p>
                )
                }
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </div>
    )
        ;
}