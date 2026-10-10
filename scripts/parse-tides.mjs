// Converts DMI tide table PDFs (e.g. tidevand-HvideSandeKyst-2026.pdf) to JSON.
// Usage: node scripts/parse-tides.mjs <pdf>... > src/app/features/weather/data/tides-hvide-sande.json
// Requires pipx (runs pdfplumber in a throwaway venv for reliable glyph positions).
import {execFileSync} from "node:child_process";

const LAT = -0.55; // Heights are relative to LAT; adding LAT gives MSL
const UTC_OFFSET_HOURS = 1; // Tables use Danish standard time all year

const isTime = (s) => /^\d{2}:\d{2}$/.test(s);
const isHeight = (s) => /^\d\.\d{2}$/.test(s);
const isDay = (s) => /^\d{1,2}$/.test(s);

function readChars(pdf) {
    const csv = execFileSync("pipx", ["run", "--spec", "pdfplumber==0.11.4", "pdfplumber", pdf, "--types", "char", "--format", "csv"],
        {encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"]});
    const [header, ...lines] = csv.trim().split("\n");
    const columns = header.split(",");
    const index = (name) => columns.indexOf(name);
    return lines.map((line) => {
        const cells = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((c) => c.replace(/,$/, "").replace(/^"|"$/g, ""));
        return {
            page: Number(cells[index("page_number")]),
            x0: Number(cells[index("x0")]),
            x1: Number(cells[index("x1")]),
            top: Math.round(Number(cells[index("top")])),
            text: cells[index("text")],
        };
    });
}

function toWords(chars) {
    const rows = Map.groupBy(chars.filter((c) => c.text.trim()), (c) => c.top);
    const words = [];
    for (const [top, row] of rows) {
        let word = null;
        for (const c of row.sort((a, b) => a.x0 - b.x0)) {
            if (word && c.x0 - word.x1 < 1.5) {
                word.text += c.text;
                word.x1 = c.x1;
            } else {
                word = {text: c.text, x0: c.x0, x1: c.x1, top};
                words.push(word);
            }
        }
    }
    return words;
}

function parse(pdf) {
    const year = Number(pdf.match(/(\d{4})\.pdf$/)[1]);
    const tides = [];
    for (const [page, chars] of Map.groupBy(readChars(pdf), (c) => c.page)) {
        const words = toWords(chars);
        const times = words.filter((w) => isTime(w.text));
        // Time columns are aligned, so their x positions form 6 clusters (2 per month)
        const columnStarts = [];
        for (const x of [...new Set(times.map((t) => Math.round(t.x0)))].sort((a, b) => a - b)) {
            if (!columnStarts.length || x - columnStarts.at(-1) > 30) columnStarts.push(x);
        }
        if (columnStarts.length !== 6) throw new Error(`Expected 6 columns on page ${page}, got ${columnStarts.length}`);

        columnStarts.forEach((startX, column) => {
            const month = (page - 1) * 3 + Math.floor(column / 2);
            let day = 0;
            for (const t of times.filter((w) => Math.abs(Math.round(w.x0) - startX) <= 30).sort((a, b) => a.top - b.top)) {
                const row = words.filter((w) => Math.abs(w.top - t.top) <= 2);
                const dayWord = row.filter((w) => isDay(w.text) && w.x1 <= t.x0 && t.x0 - w.x1 < 15).at(-1);
                if (dayWord) day = Number(dayWord.text);
                const height = row.find((w) => isHeight(w.text) && w.x0 >= t.x1 && w.x0 - t.x1 < 15);
                if (!day || !height) throw new Error(`Cannot parse ${t.text} on page ${page}`);
                const [hour, minute] = t.text.split(":").map(Number);
                tides.push({
                    time: new Date(Date.UTC(year, month, day, hour - UTC_OFFSET_HOURS, minute)).toISOString().slice(0, 16) + "Z",
                    height: Number((Number(height.text) + LAT).toFixed(2)),
                });
            }
        });
    }
    return tides;
}

const tides = process.argv.slice(2).flatMap(parse).sort((a, b) => a.time.localeCompare(b.time));

// Sanity check: high and low tides must alternate
for (let i = 1; i < tides.length - 1; i++) {
    if ((tides[i].height > tides[i - 1].height) === (tides[i + 1].height > tides[i].height)) {
        throw new Error(`Tides do not alternate at ${tides[i].time}`);
    }
}

console.log("[\n" + tides.map((t) => JSON.stringify(t)).join(",\n") + "\n]");
