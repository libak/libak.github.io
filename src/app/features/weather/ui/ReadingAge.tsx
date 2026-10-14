"use client";

import React, {useEffect, useState} from "react";
import {horizontalPadding} from "@/app/common/styles";

interface ReadingAgeProps {
    timestamp: string;
    intervalMinutes: number;
    // Interval plus the source's worst publish delay; older means the source is late or down
    lateAfterMinutes: number;
}

// Shows how fresh a reading is instead of a countdown: Kystdirektoratet publishes 2–17 min after
// each reading, so an exact "next update" time can't be known.
export const ReadingAge: React.FC<ReadingAgeProps> = ({timestamp, intervalMinutes, lateAfterMinutes}) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => setNow(new Date()), 30 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    const reading = new Date(timestamp);
    const ageMinutes = Math.max(0, Math.floor((now.getTime() - reading.getTime()) / 60000));
    const time = reading.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
    const late = ageMinutes > lateAfterMinutes;

    return (
        <p className={`text-sm ${late ? "text-amber-400" : "text-white/60"} ${horizontalPadding}`}>
            {late ? "Waiting for new data · " : ""}
            Reading {time} · {ageMinutes} min ago · new reading every {intervalMinutes} min
        </p>
    );
};
