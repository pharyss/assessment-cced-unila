// app/assessment/[id]/end/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";

export default function EndPage() {
    const { id } = useParams() as { id: string };
    const { answers, clear, next } = useAssessmentFlow(id);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
        const res = await fetch(`/api/assessment/${id}/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Gagal submit");
        // data might include resultId; store if needed
        // clear localStorage progress if you want:
        // clear();
        // navigate to result
        next(); // /assessment/[id]/result
        } catch (e: any) {
        setError(e.message || "Terjadi error");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Selesaikan Asesmen</h1>
        <p className="text-gray-600 mb-6">Klik tombol di bawah untuk mengirim jawaban dan melihat hasil.</p>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-primary px-6 py-3 text-white font-semibold"
        >
            {loading ? "Mengirim..." : "Submit & Lihat Hasil"}
        </button>
        </div>
    );
}
