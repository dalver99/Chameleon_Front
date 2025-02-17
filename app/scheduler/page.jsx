'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Page() {
  const [regions, setRegions] = useState([]);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [scheduleData, setScheduleData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [totalLoad, setTotalLoad] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 선택 가능한 지역명과 날짜 범위 설정하기
  const fetchInitialData = async () => {
    try {
      setTotalLoad(true);
      const response = await fetch('/api/exposure', { method: 'GET' });
      const data = await response.json();

      setRegions(data.regions);
      setSelectedRegion(data.regions[0]);

      setMinDate(data.min_date);
      setMaxDate(data.max_date);

      //setSelectedDate(data.min_date);
      setSelectedDate('2025-01-09');
    } catch (error) {
      console.error('초기 데이터 로드 실패:', error);
    } finally {
      setTotalLoad(false);
    }
  };

  // UTC 시간을 KST의 0~23시(오전 12시 ~ 오후 11시)로 포맷팅
  function formatHour(hour) {
    const period = hour < 12 ? '오전' : '오후';
    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12;
    return `${period} ${String(displayHour).padStart(2, '0')}:00`;
  }

  const transformScheduleData = (data) => {
    const schedule = Array.from({ length: 24 }, (_, hour) => ({
      time: formatHour(hour),
      title: '광고 없음',
      ad_id: null,
    }));

    data.forEach((item) => {
      const startTime = new Date(item.start_time);
      const kstHour = (startTime.getUTCHours()) % 24;
      schedule[kstHour] = {
        time: formatHour(kstHour),
        title: item.title,
        ad_id: item.ad_id,
      };
    });

    return schedule;
  };

  // 선택한 날짜의 데이터를 가져오기
  const fetchScheduleData = async () => {
    if (!selectedDate) return;

    try {
      setLoading(true);
      const response = await fetch('/api/exposure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: selectedRegion,
          date: selectedDate,
        }),
      });

      const data = await response.json();

      const transformedData = transformScheduleData(data);

      setScheduleData(transformedData);
    } catch (error) {
      console.error('스케줄 데이터 로드 실패:', error);
      setScheduleData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, [selectedRegion, selectedDate]);

  return (
    <div className="container mx-auto pt-6 pb-24 px-4 min-h-screen">
      <div className="text-2xl font-bold mb-6 text-center text-gray-800">광고 스케줄러</div>
      {totalLoad ? (
        <div className="text-gray-700">
          <Skeleton width={'100%'} height={400} />
        </div>
      ) : (
        <>
          <div className="flex flex-row gap-4 mb-6 justify-center">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">지역 선택</option>
              {regions.map((region, index) => (
                <option key={index} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={minDate}
              max={maxDate}
              className="px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {scheduleData === null && !loading ? (
            <div className="text-center text-gray-600">데이터를 불러오는 데 실패했습니다.</div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-6xl mx-auto">
              <div className="grid grid-cols-2 bg-gray-200 font-bold py-3 px-4">
                <div>시간</div>
                <div>광고명</div>
              </div>
              <div>
                {loading
                  ? Array.from({ length: 24 }).map((_, index) => (
                    <div key={index} className="grid grid-cols-2 py-2 px-4 border-b bg-gray-50">
                      <div className="text-gray-700">
                        <Skeleton width={80} />
                      </div>
                      <div>
                        <Skeleton width={200} />
                      </div>
                    </div>
                  ))
                  : scheduleData.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 py-2 px-4 border-b bg-white">
                      <div className="text-gray-700">{item.time}</div>
                      {item.ad_id ? (
                        <Link href={`dashboard/${item.ad_id}`}>
                          <div className="font-medium text-blue-600 hover:underline">{item.title}</div>
                        </Link>
                      ) : (
                        <div className="font-medium text-gray-400">광고 없음</div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
