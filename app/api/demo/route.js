import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const x1 = Number(formData.get("x1"));
    const y1 = Number(formData.get("y1"));
    const x2 = Number(formData.get("x2"));
    const y2 = Number(formData.get("y2"));

    if (!file || isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
      return NextResponse.json({ error: "잘못된 입력값" }, { status: 400 });
    }

    // 파일을 Blob으로 변환
    const binaryData = Buffer.from(await file.arrayBuffer());
    const blob = new Blob([binaryData], { type: file.type });

    // 외부 API 요청
    const apiUrl = `https://finalgazevolo-g5ftawdcdzete9ha.koreacentral-01.azurewebsites.net/process_image/?x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}`;
    const backendFormData = new FormData();
    backendFormData.append("file", blob, file.name);

    const response = await fetch(apiUrl, {
      method: "POST",
      body: backendFormData,
    });

    if (!response.ok) {
      throw new Error(`FastAPI 서버 응답 오류: ${response.status}`);
    }

    const result = await response.json();
    const frame_id = result.frame_id;

    // DB 조회
    const sql = `SELECT * FROM frame f LEFT JOIN ad_gaze ag ON ag.frame_id = f.id WHERE f.id = ?`;
    const gazes = await query(sql, [frame_id]);

    const img_path = gazes.length > 0 ? gazes[0].predicted_image_path : null;

    const stats = {
      gender: { male: 0, female: 0 },
      ageGroups: { "10미만": 0, "10대": 0, "20대": 0, "30대": 0, "40대": 0, "50대": 0, "60이상": 0 },
      isGaze: { gaze: 0, notGaze: 0 },
    };

    // 통계 계산
    gazes.forEach(({ pre_gender, pre_age, gazed }) => {
      if (pre_gender === "male") stats.gender.male += 1;
      else if (pre_gender === "female") stats.gender.female += 1;

      if (pre_age < 10) stats.ageGroups["10미만"] += 1;
      else if (pre_age < 20) stats.ageGroups["10대"] += 1;
      else if (pre_age < 30) stats.ageGroups["20대"] += 1;
      else if (pre_age < 40) stats.ageGroups["30대"] += 1;
      else if (pre_age < 50) stats.ageGroups["40대"] += 1;
      else if (pre_age < 60) stats.ageGroups["50대"] += 1;
      else stats.ageGroups["60이상"] += 1;

      if (gazed === 1) stats.isGaze.gaze += 1;
      else stats.isGaze.notGaze += 1;
    });

    return NextResponse.json({ frame_id, gazes, img_path, stats }, { status: 200 });
  } catch (error) {
    console.error("서버 오류:", error);
    return NextResponse.json({ error: "서버 오류", details: error.message }, { status: 500 });
  }
}
