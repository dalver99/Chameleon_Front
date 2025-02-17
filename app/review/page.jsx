'use client';

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ReviewCard, Stars } from "@/components/review/reviewUi";
import ReviewPagination from "@/components/review/ReviewPagenation";

import { PropagateLoader } from 'react-spinners';

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export default function Review() {
  const router = useRouter();

  const [rating, setRating] = useState(4.55);
  const [bestReviews, setBestReviews] = useState([]);
  const [reviewCnt, setReviewCnt] = useState(0);
  const [allRatings, setAllRatings] = useState({
    1: 100, 2: 100, 3: 100, 4: 100, 5: 100,
  });

  // GET으로 별점 정보 가져오기
  const fetchRating = async () => {
    try {
      const response = await fetch('/api/review', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRating(data.ratingAvg);
      setAllRatings(data.eachs);
      setReviewCnt(data.cnts);
      setBestReviews(data.bestReviews);
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    fetchRating();
  }, []);


  // 리뷰 개수를 영어식 표기법으로
  const numToTwoFixed = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toString();
  };

  // 부드럽게 스크롤
  const handleSmoothScroll = () => {
    document.querySelector("#reviews-section").scrollIntoView({
      behavior: "smooth",
    });
  };


  // 비율 계산을 위한 모든 리뷰들의 별점 합
  const totalReviews = useMemo(() =>
    Object.values(allRatings).reduce((a, b) => a + b, 0),
    [allRatings]
  );

  return (
    <div className="px-4 md:px-8 py-24 w-full mx-auto max-w-6xl flex flex-col gap-12">
      <div className="w-full flex flex-col gap-4 bg-blue-100 rounded-lg">
        <div className="flex flex-col md:flex-row w-full justify-between md:items-center py-4 px-8">
          <div className="text-xl md:text-3xl font-bold mb-4">
            우리 고객님들은<br />
            이렇게 평가해주셨어요.
          </div>
          <button
            className="border border-neutral-200 rounded shadow 
        text-white bg-blue-500 hover:bg-blue-600 px-4 py-2"
            type="button"
            onClick={() => {
              //router.push('/review/newReview');
            }}>
            리뷰 작성하기
          </button>
        </div>

        {/** Swiper */}
        {bestReviews.length <= 0  ? (
          <div className="w-fill h-64 flex items-center justify-center">
            <PropagateLoader size={8} color="#0067A3" />
          </div>
        ) : (
          <div className="w-full mb-4 py-3">
          <Swiper
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView='auto'
            spaceBetween={80}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            loop={true}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="mySwiper"
            modules={[EffectCoverflow, Pagination, Autoplay]}
          >
            {bestReviews.map((item) => {
              return (
                <SwiperSlide key={item.id} className="min-w-[300px] max-w-[500px] h-fit p-2">
                  <ReviewCard data={item} />
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
        )}
        
        <div className="w-full text-center">
          <button
            type="button"
            onClick={handleSmoothScroll}
            className="text-blue-500 hover:underline px-4 py-2 rounded my-6"
          >
            리뷰 더보기
          </button>
        </div>
      </div>

      {/** 별점 및 리뷰 */}
      <div id="reviews-section" className="px-4 w-full mt-8">
        <div className="text-xl font-bold mb-4">별점 & 리뷰</div>

        <div className="flex flex-row items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold mb-2">{rating.toFixed(1)}</div>
            <div className="mb-2">
              <Stars num={rating} />
            </div>
            <div className="text-gray-600">
              {numToTwoFixed(reviewCnt)}개의 리뷰
            </div>
          </div>

          <div className="w-full">
            {Object.keys(allRatings)
              .sort((a, b) => b - a)
              .map((star) => {
                const percentage = ((allRatings[star] / totalReviews) * 100).toFixed(1);
                return (
                  <div key={star} className="flex items-center mb-2">
                    <div className="w-10 text-gray-700 flex items-center gap-1">
                      <p>{star}</p>
                      <p className="text-yellow-400">★</p>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded h-4 relative">
                      <div
                        className="bg-yellow-400 h-4 rounded transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right text-gray-600">
                      {percentage}%
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/** 구분선 */}
      <div className="border-b w-full py-4 border-neutral-200"></div>

      {/** 모든 리뷰 표시 구역 */}
      <Suspense fallback={<div>Loading...</div>}>
        <ReviewPagination />
      </Suspense>
    </div>
  );
}