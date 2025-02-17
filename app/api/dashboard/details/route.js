import { NextResponse } from 'next/server';
import fs from "fs";

export async function POST(req) {
  try {
    const { ad_id } = await req.json();

    // 광고 정보 (JSON 파일에서 ad_id와 일치하는 데이터 하나만 가져오기)
    const adsData = JSON.parse(fs.readFileSync('./subDB/ads.json', 'utf-8'));
    const adInfo = adsData.find(ad => ad.ad_id == ad_id);

    if (!adInfo) {
      return NextResponse.json({ error: '광고를 찾을 수 없습니다.' }, { status: 404 });
    }

    // gaze 예측 frame 정보(임시로 탑마루로 고정시킴)
    const frames = JSON.parse(fs.readFileSync('./subDB/frames.json', 'utf-8'));

    const structuredFrames = frames.map(frame => ({
      ...frame,
    }));

    const result = {
      adInfo: adInfo,
      frames: structuredFrames
    };

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}