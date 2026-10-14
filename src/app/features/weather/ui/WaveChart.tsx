import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis
} from "recharts";
import {COLORS, CustomizedAxisTick, formatTime, WeatherChartProps} from "@/app/features/weather/ui/WindChart";
import {format} from "date-fns";
import React, {JSX} from "react";
import {WeatherData} from "@/app/features/weather/model/WeatherData";


// Whole degrees; sources report up to 10 decimals
export function formatDirection(direction: number | null | undefined): string {
    return direction === null || direction === undefined ? "" : `${Math.round(direction)}°`;
}

export function getWindArrow(direction: number | null | undefined): JSX.Element {
    return (
        direction ? (
            <span style={{transform: `rotate(${direction + 180}deg)`}} className="material-icons">
            north
        </span>) : (<></>)
    );
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({active, payload, label}) => {
    if (active && payload && payload.length) {
        const weatherData: WeatherData = payload[0].payload;
        const wave = weatherData.wave;
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
                <p className="label">{format(new Date(label), 'HH:mm')}</p>
                <p style={{color: COLORS.MAX}}>
                    Max: {wave.max} m
                </p>
                <p style={{color: COLORS.AVERAGE}}>
                    Average: {wave.average} m
                </p>
                <div className="flex items-center space-x-1">
                    <p>Direction: {formatDirection(wave.direction)}</p>
                    {getWindArrow(wave.direction)}
                </div>
                <p>
                    Period: {wave.period} sec
                </p>
            </div>
        );
    }
}

export const WaveChart: React.FC<WeatherChartProps> = ({chartData, xAxisTicks}) => {
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
            <ResponsiveContainer width="100%" height={500}>
                <LineChart
                    data={chartData}
                    margin={{top: 5, right: 16, left: 12, bottom: 5}}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                        dataKey="timestamp"
                        tick={(props) => <CustomizedAxisTick {...props} />} // Pass props to your component
                        ticks={xAxisTicks} // Use the generated hourly ticks
                        tickFormatter={formatTime} // Format ticks as "HH:mm"
                    />
                    <YAxis width={48}/>
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
                    <Line type="monotone" dataKey="wave.max" stroke={COLORS.MAX} activeDot={{r: 8}}/>
                    <Line type="monotone" dataKey="wave.average" stroke={COLORS.AVERAGE}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};