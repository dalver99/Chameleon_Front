import { NextResponse } from "next/server";
import fs from "fs";

export async function GET(req, context) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const raw = JSON.parse(fs.readFileSync("./subDB/reviews.json", "utf-8"));
    const results = raw.find(d => d.id == id);

    return NextResponse.json(results);

  } catch (error) {
    console.error("Error fetching review:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch review", details: error.message },
      { status: 500 }
    );
  }
}
