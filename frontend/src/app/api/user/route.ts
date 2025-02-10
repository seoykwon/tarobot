import { NextResponse } from "next/server";
import { fetchUserProfile } from "@/api/user";

export async function GET() {
  try {
    const data = await fetchUserProfile();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}
