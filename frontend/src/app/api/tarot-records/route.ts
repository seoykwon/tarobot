// app/api/tarot-records/route.ts
import { NextResponse } from "next/server";
import { fetchTarotRecords } from "@/api/tarotRecords";

export async function GET() {
  try {
    const data = await fetchTarotRecords();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tarot records" }, { status: 500 });
  }
}
