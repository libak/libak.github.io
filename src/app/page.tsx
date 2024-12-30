"use client"; // Mark this as a client component

import Image from "next/image";
import {WindChart} from "@/app/features/weather/ui/WindChart";
import {horizontalPadding} from "@/app/common/styles";

export default function Home() {
    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen py-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
            <main
                className="flex flex-col gap-8 row-start-2 w-full font-[family-name:var(--font-geist-mono)]">
                <div className={`flex justify-center items-center sm:items-start sm:justify-start ${horizontalPadding}`}>
                    <Image
                        src="/assets/images/libakit-logo.png"
                        alt="Libak IT ApS logo"
                        width={180}
                        height={38}
                        priority
                    />
                </div>
                <div className={`text-left ${horizontalPadding}`}>
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