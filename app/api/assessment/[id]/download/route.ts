// app/api/assessment/[id]/download/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    // real app: fetch stored result from DB and generate PDF (e.g., with pdfkit or puppeteer)
    const pdfContent = `Laporan Asesmen ${id}\n\n(Hasil disimpan di server)`;

    const encoder = new TextEncoder();
    const data = encoder.encode(pdfContent);

    return new Response(data, {
        status: 200,
        headers: {
        "Content-Type": "application/pdf", // ideally real PDF bytes
        "Content-Disposition": `attachment; filename="laporan-asesmen-${id}.pdf"`,
        },
    });
}
