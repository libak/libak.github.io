"use client";

import {useSearchParams} from "next/navigation";

export function ConsumptionConnectCompletedContent() {
    const searchParams = useSearchParams();
    const queryString = searchParams.toString();
    const fallbackHref = queryString.length > 0
        ? `minel://consumption-connect-completed?${queryString}`
        : "minel://consumption-connect-completed";

    return (
        <div className="w-full rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black/20">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/60 dark:text-white/60">
                Min El
            </p>
            <h1 className="mt-4 font-semibold">
                Consumption connection completed
            </h1>
            <p className="mt-4 text-base leading-7 text-black/70 dark:text-white/70">
                If the app did not open automatically, tap here to continue in Min El.
            </p>
            <a
                href={fallbackHref}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-black"
            >
                Open in Min El
            </a>
        </div>
    );
}
