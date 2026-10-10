import React, {useEffect, useState} from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis
} from "recharts";
import {addDays, addHours, format, startOfDay} from "date-fns";
import {listTideCurve, TidePoint} from "@/app/features/weather/usecase/TideUseCase";

const TIDE_COLOR = "#0649c2";
const NOW_COLOR = "#f51d93";

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({active, payload}) => {
    if (active && payload && payload.length) {
        const point: TidePoint = payload[0].payload;
        return (
            <div className="custom-tooltip"
                 style={{
                     backgroundColor: 'rgba(255, 255, 255, 1.0)',
                     padding: '10px',
                     borderRadius: '5px',
                     color: 'black',
                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                 }}
            >
                <p className="label">{format(new Date(point.time), 'HH:mm')}</p>
                <p style={{color: TIDE_COLOR}}>Tide: {point.height} m</p>
            </div>
        );
    }
}

export const TideChart: React.FC = () => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => setNow(new Date()), 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    const start = startOfDay(now);
    const end = addDays(start, 1);
    const data = listTideCurve(start, end);
    const ticks = Array.from({length: 13}, (_, i) => addHours(start, i * 2).getTime());

    // noinspection TypeScriptValidateTypes
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={data}
                margin={{top: 20, right: 30, left: 20, bottom: 5}}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis
                    dataKey="time"
                    type="number"
                    domain={[start.getTime(), end.getTime()]}
                    ticks={ticks}
                    tickFormatter={(time: number) => time === end.getTime() ? "24:00" : format(new Date(time), "HH:mm")}
                />
                <YAxis unit=" m"/>
                <Tooltip content={<CustomTooltip/>}/>
                <ReferenceLine y={0} stroke="#666"/>
                <ReferenceLine
                    x={now.getTime()}
                    stroke={NOW_COLOR}
                    strokeWidth={2}
                    label={{value: format(now, "HH:mm"), position: "top", fill: NOW_COLOR}}
                />
                <Line type="monotone" dataKey="height" stroke={TIDE_COLOR} dot={false} strokeWidth={2}/>
            </LineChart>
        </ResponsiveContainer>
    );
};
