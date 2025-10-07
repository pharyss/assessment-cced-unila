"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";

export default function ResultPage() {
    const { id } = useParams() as { id: string };
    const { clear } = useAssessmentFlow(id);
    const [loading, setLoading] = useState(false);

    // clear session saat halaman dibuka
    useEffect(() => {
        clear();
    }, [clear]);

    const handleDownload = async () => {
        setLoading(true);
        try {
        const res = await fetch(`/api/assessment/${id}/download`, {
            method: "GET",
        });

        if (!res.ok) throw new Error("Gagal mengunduh laporan");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `hasil-asesmen-${id}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
        } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat mengunduh laporan.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="container py-20 text-center">
        <h1 className="mb-4 text-3xl font-bold">Hasil Asesmen</h1>
        <p className="mb-8">
            Ringkasan hasil asesmenmu dengan ID: <strong>{id}</strong>
        </p>

        <button
            onClick={handleDownload}
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/80 disabled:opacity-50"
        >
            {loading ? "Menyiapkan..." : "Unduh Laporan PDF"}
        </button>
        </div>
    );
}
