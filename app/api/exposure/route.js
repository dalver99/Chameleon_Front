import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const d = {
      regions: ['군자역', '잠실역', '강남역'],
      min_date: '2025-01-07',
      max_date: '2025-01-17'
    };

    return NextResponse.json(d, { status: 200 });

  } catch (error) {
    console.error("데이터 조회 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const { region, date } = await req.json();

    const rawData = fs.readFileSync("./subDB/exposure.json", "utf-8");
    const results = JSON.parse(rawData);

    const startTimeUTC = new Date(`${date}T00:00:00+09:00`).toISOString();
    const endTimeUTC = new Date(`${date}T23:59:59+09:00`).toISOString();

    const filteredResults = results.filter((item) => {
      return (
        item.start_time >= startTimeUTC &&
        item.start_time <= endTimeUTC &&
        item.name === region
      );
    });

    return NextResponse.json(filteredResults, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}