"use client"; // Mark this as a client component

import Image from "next/image";
import {PureComponent, useEffect, useState} from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    TooltipProps
} from "recharts";
import {addHours, format, startOfHour} from "date-fns";

const COLORS = {
    GUST: "#8884d8",
    AVERAGE: "#82ca9d",
};

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

// Props for the custom tick
interface CustomizedAxisTickProps {
    x: number;
    y: number;
    stroke?: string;
    payload: {
        value: string | number;
    };
}

class CustomizedAxisTick extends PureComponent<CustomizedAxisTickProps> {
    render() {
        const {x, y, payload} = this.props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
                    {format(new Date(payload.value), "HH:mm")}
                </text>
            </g>
        );
    }
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({active, payload, label}) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip"
                 style={{
                     backgroundColor: 'rgba(255, 255, 255, 1.0)', // White with 80% transparency
                     padding: '10px',
                     borderRadius: '5px',
                     color: 'black', // Ensure the text is visible on a light background
                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // Optional: Add a subtle shadow
                 }}
            >
                <p className="label">{`${format(new Date(label), 'HH:mm')}`}</p>
                <p className="gust"
                   style={{color: COLORS.GUST}} // Inline style for text color
                >
                    {`Gust: ${payload[0].value} m/s`}
                </p>
                <p className="average"
                   style={{color: COLORS.AVERAGE}} // Inline style for text color
                >
                    {`Average: ${payload[1].value} m/s`}
                </p>
            </div>
        );
    }
}

const findNearestDatapoint = (data: WindDataFormatted[], targetTimestamp: string) => {
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
                    timestamp: new Date(item.timestamp).toISOString(), // Ensure ISO format
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

    if (!chartData || chartData.length === 0) {
        return <p>Loading...</p>;
    }

    // Generate hourly ticks between the start and end of your data
    const generateHourlyTicks = (start: Date, end: Date) => {
        const ticks = [];
        let current = startOfHour(start);
        while (current <= end) {
            ticks.push(current.toISOString()); // ISO format
            current = addHours(current, 1); // Move to the next hour
        }
        return ticks;
    };

    // Find the range of your data for tick generation
    const startTime = new Date(chartData[0].timestamp);
    const endTime = new Date(chartData[chartData.length - 1].timestamp);
    const hourlyTicks = generateHourlyTicks(startTime, endTime);

    const xAxisTicks = hourlyTicks.map((tick) => {
        const nearest = findNearestDatapoint(chartData, tick);
        return nearest.timestamp;
    });

    const formatTime = (tick: string) => format(new Date(tick), "HH:mm");

    // Beacuse of CustomTooltip then we need no inspection of TypeScriptValidateTypes
    // noinspection TypeScriptValidateTypes
    return (
        <div className="">
            <style>
                {`
          .recharts-surface {
            overflow: visible !important;
            position: relative !important;
          }
        `}
            </style>
            <div className="flex flex-wrap gap-8">
                <h1>Time: {currentWeather ? (new Date(currentWeather.timestamp).toLocaleTimeString()) : ""}</h1>
                <h1>Current: {currentWeather?.average} m/s</h1>
                <h1>Max: {currentWeather?.gust} m/s</h1>
            </div>
            <br/>
            {chartData ? (
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart
                        data={chartData}
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            dataKey="timestamp"
                            tick={(props) => <CustomizedAxisTick {...props} />} // Pass props to your component
                            ticks={xAxisTicks} // Use the generated hourly ticks
                            tickFormatter={formatTime} // Format ticks as "HH:mm"
                        />
                        <YAxis/>
                        <Tooltip content={
                            <CustomTooltip/>
                        }/>
                        <Legend
                            wrapperStyle={{
                                position: "relative",
                                marginTop: "20px",
                                textAlign: "center"
                            }}
                        />
                        <Line type="monotone" dataKey="gust" stroke={COLORS.GUST} activeDot={{r: 8}}/>
                        <Line type="monotone" dataKey="average" stroke={COLORS.AVERAGE}/>
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
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen py-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main
                className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full font-[family-name:var(--font-geist-mono)]">
                <Image
                    src="/assets/images/libakit-logo.png"
                    alt="Libak IT ApS logo"
                    width={180}
                    height={38}
                    priority
                />
                <div className="text-left">
                    <h1>Hvide Sande {new Date().toLocaleTimeString()}</h1>
                    <h2>Wind</h2>
                </div>
                <div className="w-full">
                    <WindChart/>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </div>
    );
}