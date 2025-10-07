import { NextResponse } from "next/server";

const STORE = new Map(); // if you used different scope, integrate with DB

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const stored = STORE.get(id);
    if (!stored) {
        return NextResponse.json(null);
    }
    return NextResponse.json(stored.result);
}
