"use client"

import { CustomProgress } from "@/components/boardUi";
import { AdsListSkeleton } from "@/components/skeletions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AdsState = () => {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [isLoad, setIsLoad] = useState(true);

  const [uid, setUid] = useState(1);


  // 모든 광고 목록을 가져오는 함수
  const fetchAds = async (uid) => {
    try {
      setIsLoad(true);
      const res = await fetch('/api/dashboard/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: uid }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '광고 정보를 불러오는 데 실패했습니다.');
      }

      const data = await res.json();
      setData(data);

    } catch (error) {
      setData(null);
    } finally {
      setIsLoad(false);
    }
  };

  // 초기 렌더링 시 데이터 패칭
  useEffect(() => {
    fetchAds(uid);
  }, [uid]);


  // 로딩 스켈레톤
  if (isLoad) {
    return (
      <div className="px-4 lg:px-8 py-12 mx-auto lg:max-w-4xl">
        <AdsListSkeleton />
      </div>
    );
  }

  // 출력
  return (
    <div className="">
      <div className="px-4 lg:px-8 py-12 mx-auto lg:max-w-4xl">
        <div className="flex flex-row gap-2 items-center justify-between mb-8">
          <div className="font-bold text-lg">광고 목록</div>
          <button
            className="rounded text-neutral-50 bg-green-500 hover:bg-green-600 px-5 py-1 shadow"
            type="button"
            onClick={() => {
              router.push('/registAds');
            }}
          >
            새 광고 등록하기
          </button>
        </div>

        {/** 유저 등록 광고 리스트 */}
        <div className="flex flex-col">
          {data == null ? <>
            {/** 등록한 광고가 없음 */}
            <div className="">등록한 광고가 없습니다.</div>
          </> : <>
            {/** 1개 이상 등록한 광고 존재 */}
            {data.map((ad, idx) => {
              return (<ImgCard data={ad} key={idx} />);
            }
            )}
          </>}
        </div>

      </div>
    </div >
  );
};

export default AdsState;

// 이미지 카드
export const ImgCard = ({ data }) => {
  const formatAdDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);

      return `${year}.${month}.${day}`;
    };

    return `${formatDate(start)} ~ ${formatDate(end)}`;
  }

  // 광고 상태 반환 함수
  const determineAdStatus = () => {
    const now = new Date();
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    const remainingBudget = data.remaining_budget || 0;
    const totalBudget = parseFloat(data.budget);

    if (now < startDate) {
      return {
        text: '대기중',
        color: 'bg-orange-500'
      };
    }

    if (now > endDate || remainingBudget <= 0 || remainingBudget / totalBudget < 0.01) {
      return {
        text: '종료',
        color: 'bg-red-500'
      };
    }

    return {
      text: '진행중',
      color: 'bg-green-500'
    };
  };

  const adStatus = determineAdStatus();

  return (
    <Link href={`dashboard/${data.ad_id}`}>
      <div className={`border-y bg-white h-64 overflow-hidden
        ${adStatus.text === '종료' ? 'brightness-90' : 'hover:bg-neutral-200'}`}>
        <div className="flex flex-row h-full">
          {/** 이미지 섹션 */}
          <div className="w-2/3 h-full relative overflow-hidden">
            {/* 배경 */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-sm brightness-50"
              style={{ backgroundImage: `url(${data.image_path})` }}
            ></div>
            {/* 이미지 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                width={1200}
                height={800}
                src={data.image_path}
                alt={data.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/** 내용 */}
          <div className="w-1/3 min-w-44 px-4 py-8 overflow-hidden flex flex-col gap-1">
            {/** 제목 기간 */}
            <div className="flex flex-col">
              <div className="text-xl font-semibold">{data.title}</div>
              <div className="text-neutral-500">
                {formatAdDate(data.start_date, data.end_date)}
              </div>
            </div>

            {/** 상태 */}
            <div className="flex-1">
              <div className={`rounded-full text-sm font-bold w-fit px-2 text-white text-center ${adStatus.color}`}>
                {adStatus.text}
              </div>
            </div>

            {/** 예산 */}
            <div className="text-sm flex flex-col items-end justify-center">
              <div className="w-full">
                <CustomProgress value={data.remaining_budget || 0} max={data.budget} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
