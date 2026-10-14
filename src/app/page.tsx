import Image from "next/image";

const GUSTSPOT_URL = "https://gustspot.com";

// The Hvide Sande weather page moved to its own site; this home page points visitors there
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 text-center font-[family-name:var(--font-geist-mono)]">
            <a href={GUSTSPOT_URL} aria-label="GustSpot">
                <Image src="/assets/images/gustspot-logo.png" alt="GustSpot logo" width={360} height={98} priority/>
            </a>
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl">This page has moved to GustSpot.com</h1>
                <p className="opacity-70">
                    Live wind and waves for Hvide Sande, Thorsminde and Thyborøn are now on GustSpot.
                </p>
            </div>
            <a
                href={GUSTSPOT_URL}
                className="rounded-md border border-neutral-500/50 px-5 py-2 hover:border-neutral-500 hover:bg-neutral-500/10"
            >
                Go to GustSpot.com →
            </a>
        </main>
    );
}
