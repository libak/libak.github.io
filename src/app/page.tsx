"use client"; // Mark this as a client component

import Image from "next/image";
import {useEffect, useState} from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

export interface WindData {
    timestamp: string; // ISO 8601 string
    average: number;   // Average wind speed in m/s
    gust: number;      // Gust wind speed in m/s
}

export interface WindDataFormatted {
    timestamp: string; // ISO 8601 string
    average: number;   // Average wind speed in m/s
    gust: number;      // Gust wind speed in m/s
}

const WindChart = () => {
    const [chartData, setChartData] = useState<WindDataFormatted[] | null>(null); // Use WindData[] for type safety
    const [currentWeather, setCurrentWeather] = useState<WindDataFormatted | null>(null); // Use WindData[] for type safety


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://europe-west1-hyden-libak.cloudfunctions.net/getWindData");
                // const response = await fetch("https://run.mocky.io/v3/ac50b20a-4af0-4190-af74-47b83bba4c88");
                const data: WindData[] = await response.json();
                // Transform the data to make it compatible with the chart
                const formattedData: WindDataFormatted[] = data.map((item: WindData) => ({
                    ...item,
                    timestamp: new Date(item.timestamp).toLocaleTimeString(), // Format the timestamp
                }));
                setChartData(formattedData); // Update state with formatted data
                setCurrentWeather(formattedData[formattedData.length - 1]);
            } catch (error) {
                console.error("Error fetching wind data:", error);
            }
        };

        fetchData(); // Call the fetch function

        // Set up the interval to re-fetch data every 1 minute
        const intervalId = setInterval(fetchData, 60 * 1000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <div className="">
            <div className="flex flex-row gap-8">
                <h1>Last fetched: {new Date().toLocaleTimeString()}</h1>
                <h1>Time: {currentWeather?.timestamp}</h1>
                <h1>Current: {currentWeather?.average} m/s</h1>
                <h1>Max: {currentWeather?.gust} m/s</h1>
            </div>
            <br/>
            {chartData ? (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        data={chartData}
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="timestamp"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Line type="monotone" dataKey="gust" stroke="#8884d8" activeDot={{r: 8}}/>
                        <Line type="monotone" dataKey="average" stroke="#82ca9d"/>
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default function Home() {
    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main
                className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full font-[family-name:var(--font-geist-mono)]">
                <Image
                    src="/assets/images/libakit-logo.png"
                    alt="Libak IT ApS logo"
                    width={180}
                    height={38}
                    priority
                />
                <div className="text-center sm:text-left">
                    <h1>Hyden weather historic</h1>
                </div>
                <div className="w-full max-w-5xl">
                    <WindChart/>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </div>
    );
}