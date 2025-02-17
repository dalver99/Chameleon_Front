'use client'

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ModelRun() {
  const router = useRouter();
  const swiperRef = useRef(null);

  const [pairNum, setPairNum] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  const moveToDemo = () => {
    router.push('/model/demo');
  };

  const imgLinks = [
    { input: "https://imgur.com/aG09V75.png", output: "https://imgur.com/7CwU0xF.png" },
    { input: "https://imgur.com/CYwM92o.png", output: "https://imgur.com/bJwt52A.png" },
    { input: "https://imgur.com/YrSmkyw.png", output: "https://imgur.com/7PfcYMl.png" },
    { input: "https://imgur.com/5wn2SUB.png", output: "https://imgur.com/MazeaKF.png" },
  ];

  const [selImgs, setSelImgs] = useState([imgLinks[0].input, imgLinks[0].output]);

  // 이미지 미리 로딩
  useEffect(() => {
    imgLinks.forEach(({ input, output }) => {
      const loadImage = (src) => {
        if (!loadedImages[src]) {
          const img = new Image();
          img.src = src;
          img.onload = () => setLoadedImages((prev) => ({ ...prev, [src]: true }));
        }
      };

      loadImage(input);
      loadImage(output);
    });
  }, [imgLinks]);

  useEffect(() => {
    const { input, output } = imgLinks[pairNum];
    setSelImgs([input, output]);
    setIsLoading(!loadedImages[input] || !loadedImages[output]);

    // if (swiperRef.current) {
    //   swiperRef.current.slideTo(0);
    // }
  }, [pairNum, loadedImages]);

  return (
    <div className="flex flex-col px-4 py-12 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
          모델 소개
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-xl shadow-lg p-6">
          {/** Swiper 이미지 슬라이드 */}
          <div className="w-full lg:w-2/3 flex flex-col items-start">
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              loop
              className="w-full rounded-lg shadow-md overflow-hidden"
              onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
              {selImgs.map((img, index) => (
                <SwiperSlide key={index} className="w-full flex justify-center items-center">
                  {isLoading ? (
                    <div className="w-full h-full min-h-[30vh]">
                      <Skeleton height={320} width="100%" />
                    </div>
                  ) : (
                    <img
                      src={img}
                      alt={`Slide ${index}`}
                      className="w-full h-full object-contain"
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>

            {/* 이미지 쌍 선택 버튼 */}
            <div className="flex gap-3 mt-4">
              {imgLinks.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPairNum(i)}
                  className={`px-4 py-2 rounded-full transition-all ${i === pairNum
                    ? "bg-green-500 text-white font-bold"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/** 모델 설명 */}
          <div className="flex-1 text-gray-700 text-lg p-4 bg-gray-50 rounded-lg">
            <p className="mb-1">응시 위치를 추정하는 <span className="font-semibold text-emerald-500">Gaze-LLE</span>와,</p>
            <p className="mb-1">성별과 연령을 추정하는 <span className="font-semibold text-emerald-500">MiVOLO</span></p>
            <p className="mb-4">두 개 모델을 활용하였습니다.</p>
            <p className="mb-1">이미지에 광고판 영역을 지정해 주면</p>
            <p className="mb-1">보행자들의 광고판 응시 여부와</p>
            <p className="mb-1">각 보행자들의 성별과 연령을 예측해</p>
            <p className="mb-4">원본 이미지에 표시해 줍니다.</p>
            <p>아래 버튼을 눌러 실제 모델을 체험해볼 수 있습니다.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={moveToDemo}
          className="font-bold text-lg text-white bg-green-500 hover:bg-green-600 transition-colors text-center mx-auto px-8 py-3 shadow-lg rounded-full my-12 block"
        >
          이미지 파일로 모델 체험하기
        </button>
      </div>
    </div>
  );
}
