import React, {PureComponent} from "react";
import {format} from "date-fns";
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
import {WeatherData} from "@/app/features/weather/model/WeatherData";
import {getWindArrow} from "@/app/features/weather/ui/WaveChart";

export const COLORS = {
    MAX: "#f51d93",
    AVERAGE: "#82ca9d",
};

export interface WeatherChartProps {
    chartData: WeatherData[];
    xAxisTicks: string[];
}

// Props for the custom tick
export interface CustomizedAxisTickProps {
    x: number;
    y: number;
    stroke?: string;
    payload: {
        value: string | number;
    };
}

export class CustomizedAxisTick extends PureComponent<CustomizedAxisTickProps> {
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

export const formatTime = (tick: string) => format(new Date(tick), "HH:mm");

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({active, payload, label}) => {
    if (active && payload && payload.length) {
        const weatherData: WeatherData = payload[0].payload;
        const wind = weatherData.wind;
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
                <p className="gust"
                   style={{color: COLORS.MAX}} // Inline style for text color
                >
                    Gust: {wind.gust} m/s
                </p>
                <p className="average"
                   style={{color: COLORS.AVERAGE}} // Inline style for text color
                >
                    Average: {wind.average} m/s`
                </p>
                <div className="flex items-center space-x-1">
                    <p>Direction: {wind.direction}°</p>
                    {getWindArrow(wind.direction)}
                </div>
            </div>
        );
    }
}

export const WindChart: React.FC<WeatherChartProps> = ({chartData, xAxisTicks}) => {
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
                    <Line type="monotone" dataKey="wind.gust" stroke={COLORS.MAX} activeDot={{r: 8}}/>
                    <Line type="monotone" dataKey="wind.average" stroke={COLORS.AVERAGE}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};