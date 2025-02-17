'use client'

import { useEffect, useState, useContext, useMemo } from 'react';
import { useParams } from 'next/navigation';

import NaverMap from '@/components/NaverMap';
import MapContext from '@/providers/MapProvider';
import { CustomProgress, LineChart, PieChart, TextStatBox } from '@/components/boardUi';
import { ImgPlayer } from '@/components/ImgPlayer';
import { AdsInfoSkeleton } from '@/components/skeletions';
import { FaImage } from "react-icons/fa";

export default function () {
  const { ad_id } = useParams();
  const [data, setData] = useState({
    adInfo: null,
    frames: []
  });
  const [isLoad, setIsLoad] = useState(true);
  const [isError, setIsError] = useState(false);

  // 데이터 패칭
  const fetchData = async (ad_id) => {
    try {
      setIsLoad(true);
      const response = await fetch('/api/dashboard/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ad_id: ad_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '데이터를 불러오는 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setData(data);
      setIsError(false);

    } catch (error) {
      setIsError(true);

    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    fetchData(ad_id);
  }, [ad_id]);

  // 크레딧 충전
  const handleCredit = (e) => {
    e.preventDefault();
    alert('크레딧 충전은 프로토타입으로, 구현되지 않았습니다.');
  };


  // 통계 부분
  const [timescale, setTimescale] = useState("all");
  // data.frames.captured_at을 기준으로 범위에 맞는 데이터에 대해 통계 구하기
  // 나중에 드롭다운으로 '하루', '일주일' 등 기간을 드롭다운으로 설정해 그에 맞는 통계 볼 수 있게끔
  const [stats, setStats] = useState({
    gender: { male: 0, female: 0 },
    ageGroups: {
      '10미만': 0,
      '10대': 0,
      '20대': 0,
      '30대': 0,
      '40대': 0,
      '50대': 0,
      '60이상': 0
    },
    isGaze: {
      gaze: 0,
      notGaze: 0,
    }
  });

  useEffect(() => {
    if (data == null) return;

    const calculateStats = () => {
      const statsResult = {
        gender: { male: 0, female: 0 },
        ageGroups: {
          '10미만': 0,
          '10대': 0,
          '20대': 0,
          '30대': 0,
          '40대': 0,
          '50대': 0,
          '60이상': 0
        },
        isGaze: {
          gaze: 0,
          notGaze: 0,
        }
      };

      data.frames.forEach(frame => {
        // 성별 통계
        if (frame.pre_gender === 'male') statsResult.gender.male++;
        if (frame.pre_gender === 'female') statsResult.gender.female++;

        // 연령대 통계
        const age = frame.pre_age;
        if (age < 10) statsResult.ageGroups['10미만']++;
        else if (age < 20) statsResult.ageGroups['10대']++;
        else if (age < 30) statsResult.ageGroups['20대']++;
        else if (age < 40) statsResult.ageGroups['30대']++;
        else if (age < 50) statsResult.ageGroups['40대']++;
        else if (age < 60) statsResult.ageGroups['50대']++;
        else statsResult.ageGroups['60이상']++;

        // 응시 통계
        if (frame.gazed) statsResult.isGaze.gaze++;
        else statsResult.isGaze.notGaze++;
      });

      setStats(statsResult);
    };

    calculateStats();
  }, [data, timescale]);

  // 조회수 추이 그래프를 위한 임시 데이터
  const yesterday = {
    "00:00": 32, "01:00": 232, "02:00": 121, "03:00": 89, "04:00": 43, "05:00": 65,
    "06:00": 98, "07:00": 120, "08:00": 145, "09:00": 210, "10:00": 312, "11:00": 405,
    "12:00": 523, "13:00": 412, "14:00": 360, "15:00": 312, "16:00": 280, "17:00": 290,
    "18:00": 350, "19:00": 420, "20:00": 480, "21:00": 530, "22:00": 550, "23:00": 523,
  };
  const today = {
    "00:00": 25, "01:00": 210, "02:00": 100, "03:00": 80, "04:00": 40, "05:00": 60,
    "06:00": 90, "07:00": 110, "08:00": 140, "09:00": 200, "10:00": 300, "11:00": 390,
    "12:00": 500, "13:00": 400,
  };

  // 타겟 정보 텍스트화
  const targetString = (arr) => {
    let res = "";
    const gender = arr[0];

    const ageGroups = arr
      .slice(1)
      .filter(item => item.includes("gen"))
      .map(item => parseInt(item))
      .sort((a, b) => a - b);

    let ranges = [];
    let start = ageGroups[0];

    for (let i = 1; i <= ageGroups.length; i++) {
      if (i === ageGroups.length || ageGroups[i] !== ageGroups[i - 1] + 10) {
        ranges.push(start === ageGroups[i - 1] ? `${start}대` : `${start} ~ ${ageGroups[i - 1]}대`);
        start = ageGroups[i];
      }
    }

    res += ranges.join(", ");
    if (res == '10 ~ 60대') res = '전연령';

    if (gender === "male") res += " 남성 타겟";
    else if (gender === "female") res += " 여성 타겟";
    else res += " 타겟";

    return res;
  };

  // 지도에서 사용할 마커
  const { curMark, setCurMark, markers, setMarkers } = useContext(MapContext);

  useEffect(()=>{
    setCurMark(null);
  },[]);

  const uniqueMarkers = useMemo(() => { // frame에 저장된 모든 유니크한 위치 정보들을 찾기
    if (!data?.frames) return [];
    
    const uniqueLocations = new Map();
    
    data.frames.forEach(frame => {
      const key = `${frame.latitude},${frame.longitude}`;
      if (!uniqueLocations.has(key)) {
        uniqueLocations.set(key, {
          name: frame.name,
          lat: frame.latitude,
          lng: frame.longitude,
          state: 'on'
        });
      }
    });
    
    return Array.from(uniqueLocations.values());
  }, [data?.frames]);
  
  useEffect(() => { // 마커 정보 업데이트
    setMarkers(uniqueMarkers);
  }, [setMarkers, uniqueMarkers, markers]);
  
  const [selMarker, setSelMarker] = useState(null); // 현재 선택된 지역의 정보
  useEffect(() => {
    if (curMark != null && markers) {
      setSelMarker(markers[curMark]);
    } else {
      setSelMarker(null);
    }
  }, [curMark, markers]);


  // 이미지 플레이어에서 보여줄 프레임
  const [camId, setCamId] = useState(null);

  // 추후 선택된 지역(selMarker와 카메라 위치에 따라 보여질 영상을 다르게 처리)

  useEffect(() => {
    if (data?.frames?.length > 0 && camId === null) {
      setCamId(data.frames[0].camera_id);
    }
  }, [data, camId]);

  const filteredFrames = useMemo(() => {
    if (!data?.frames) return [];
    
    // 먼저 선택된 카메라 ID에 대한 프레임만 필터링
    const cameraFrames = data.frames.filter(frame => frame.camera_id === camId);
    
    // 동일한 프레임 ID에 대해 가장 최근의 프레임만 유지
    const uniqueFrames = cameraFrames.reduce((acc, current) => {
      const x = acc.find(item => item.frame_id === current.frame_id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  
    return uniqueFrames;
  }, [data?.frames, camId]);

  // 해당 광고가 시행된 지역 -> 나중에 마커로 표시되게끔 수정
  const uniqueCameraIds = useMemo(() => { 
    if (!data?.frames) return [];
    return [...new Set(data.frames.map(frame => frame.camera_id))];
  }, [data?.frames]);


  // 로딩 시 스켈레톤 표시
  if (isLoad) {
    return (
      <div className="px-4 lg:px-12 py-8">
        <AdsInfoSkeleton />
      </div>
    );
  }

  // 출력 부분
  return (
    <div className="px-4 lg:px-12 py-8 mx-auto w-full max-w-6xl">
      {(data == null || data.adInfo == null || isError) ? (
        <div className="">
          해당 광고에 대한 데이터가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/** 정보 */}
          <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
            {/** 기본 정보 */}
            <div className="rounded-lg px-6 py-4 border flex flex-col col-span-1 md:col-span-2">
              <div className="flex flex-row gap-2 w-full h-full">
                <div className="flex-1 flex flex-col">
                  <div className="text-2xl font-bold">{data.adInfo.title}</div>
                  <div className="text text-neutral-500 flex-1">{data.adInfo.category_name}</div>
                  <div className="">{targetString(data.adInfo.target)}</div>
                </div>
                <div className="">
                  <button type="button"
                    onClick={() => {
                      // 새 창에서 이미지 열기
                      window.open(data.adInfo.image_path)
                    }}
                    className='rounded shadow p-2 border bg-white hover:bg-neutral-200 size-8 flex items-center justify-center'
                  >
                    <FaImage />
                    {/** 나중에 이미지 아이콘으로 변경할 거임 */}
                  </button>
                </div>
              </div>
            </div>

            {/** 크레딧 */}
            <div className="px-6 py-4 rounded-lg border col-span-1">
              <div className="font-bold mb-4">남은 크레딧</div>
              <CustomProgress
                value={data.adInfo.remaining_budget}
                max={data.adInfo.budget}
              />
              <button
                type='button'
                onClick={handleCredit}
                className='w-full py-1 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded'
              >
                충전하기
              </button>
            </div>
          </div>

          {/** 카드 섹션 */}
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <TextStatBox title="누적 노출수" mainText="3,011" subText="어제보다 20.1% 증가" />
            <TextStatBox title="누적 조회수" mainText="1,224" subText="어제보다 10.1% 증가" />
            <TextStatBox title="동일 카테고리 대비 조회수" mainText="상위 10%" subText="어제보다 1.1% 감소" />

            <TextStatBox title="주요 관심 요일" mainText="금요일" subText="평균 응시율의 1.2배" />
            <TextStatBox title="주요 관심 시간" mainText="오후 5시" subText="평균 응시율의 1.17배" />
            <TextStatBox title="타겟 적합성" mainText="적합" subText="" />
          </div>

          {/** 지도 */}
          <div className="border px-6 py-4 rounded-lg">
            <div className="w-full flex flex-row items-center justify-between mb-4 gap-2">
              <div className="text-lg font-bold flex-1">실시간 광고 현황</div>
              <div className="">현재 {markers.length}개소 광고중</div>
              <div className={`size-3 rounded-full ${markers.length <= 0 ? "bg-yellow-400" : "bg-green-600"}`}></div>
            </div>

            <div className="w-full h-96">
              <NaverMap />
            </div>

            {/** 이미지 플레이어 */}
            {selMarker != null && (
              <div className="w-full min-h-96 flex items-center justify-center">
                {data && data.frames && data.frames.length > 0 ? (
                  <div className='w-full'>
                    <div className="border-b w-full py-4"/>

                    <div className="mt-4 flex flex-row justify-between items-end">
                      <div className="text-lg font-bold">{selMarker.name}</div>
                      <div className="">
                        <select
                          value={camId || ''}
                          onChange={(e) => setCamId(Number(e.target.value))}
                          className="border rounded px-2 py-1"
                        >
                          {uniqueCameraIds.map(id => (
                            <option key={id} value={id}>
                              Camera {id}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-500 mb-4">드래그하여 시점을 선택할 수 있습니다.</div>

                    <ImgPlayer frames={filteredFrames} />
                  </div>
                ) : (
                  <div>Loading frames...</div>
                )}
              </div>
            )}
          </div>


          {/** 일일 조회수 추이 - 임시로 고정 데이터로 */}
          <div className="border px-6 py-4 rounded-lg">
            <div className="font-bold text-lg">일일 조회수 추이</div>
            <LineChart yesterday={yesterday} today={today} />
          </div>

          {/** 파이차트 */}
          <div className="flex flex-col lg:flex-row gap-2">
            <PieChart
              title="성별 분포"
              sub="성별"
              data={stats}
            />
            <PieChart
              title="연령대 분포"
              sub="연령대"
              data={stats}
            />
            <PieChart
              title="응시 여부"
              sub="응시 여부"
              data={stats}
            />
          </div>

        </div>
      )}
    </div>
  );
}
