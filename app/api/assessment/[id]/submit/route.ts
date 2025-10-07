import { NextResponse } from "next/server";

type Stored = { id: string; answers: any; result: any; createdAt: string };
const STORE = new Map<string, Stored>(); // demo only

function computeResult(answers: any) {
    // placeholder: hitung skor sederhana
    let score = 0;
    if (!answers) return { score: 0, category: "Unknown" };
    for (const k of Object.keys(answers)) {
        const v = answers[k];
        if (typeof v === "string" && v.toLowerCase().includes("setuju")) score += 20;
    }
    const category = score >= 60 ? "Baik" : score >= 30 ? "Cukup" : "Perlu Perbaikan";
    return { score, category, details: answers };
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    try {
        const body = await req.json();
        const { answers } = body;
        if (!answers) return NextResponse.json({ error: "answers required" }, { status: 400 });

        // server-side validation: ensure shapes, lengths, etc.
        // sanitize inputs (strip scripts) — omitted for brevity

        const result = computeResult(answers);
        const stored: Stored = { id: Date.now().toString(), answers, result, createdAt: new Date().toISOString() };
        STORE.set(id, stored);

        return NextResponse.json({ success: true, storedId: stored.id, result });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}
