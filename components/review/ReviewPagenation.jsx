'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Stars } from "./reviewUi";
import { FaHeart, FaComment } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ReviewPagination() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageLimit = 10;
  const sorting = ["최신순", "별점 높은순", "별점 낮은순", "공감 많은순", "댓글 많은순"];
  const sortEng = ['latest', 'highRating', 'lowRating', 'mostLikes', 'mostComments'];

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [sortNum, setSortNum] = useState(sortEng.indexOf(searchParams.get("sort")) !== -1 ? sortEng.indexOf(searchParams.get("sort")) : 0);
  const [totalPages, setTotalPages] = useState(1);
  const [isReviewLoad, setIsReviewLoad] = useState(false);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    setIsReviewLoad(true);
    try {
      const query = {
        sorting: sortEng[sortNum],
        page: currentPage,
        limit: pageLimit,
      };

      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setTotalPages(data.meta.totalPages || 1);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsReviewLoad(false);
    }
  };

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const np = Math.min(totalPages, page);
    const sort = sortEng.indexOf(searchParams.get("sort"));

    const newUrl = `?page=${np}&sort=${sortEng[sort]}`;
    window.history.replaceState(null, "", newUrl);

    setCurrentPage(np);
    setSortNum(sort !== -1 ? sort : 0);
  }, [searchParams]);

  useEffect(() => {
    fetchReviews();
  }, [currentPage, sortNum]);

  const handlePageChange = (newPage) => {
    const np = Math.min(totalPages, newPage);
    setCurrentPage(np);
    const newUrl = `?page=${np}&sort=${sortEng[sortNum]}`;
    window.history.replaceState(null, "", newUrl);
    //router.replace(`?page=${newPage}&sort=${sortEng[sortNum]}`, undefined, { scroll: false });
  };

  const handleSortChange = (newSortNum) => {
    setSortNum(newSortNum);
    const newUrl = `?page=${currentPage}&sort=${sortEng[newSortNum]}`;
    window.history.replaceState(null, "", newUrl);
    //router.replace(`?page=1&sort=${sortEng[newSortNum]}`, undefined, { scroll: false });
  };

  const maskName = (name) => {
    return name.replace(/^(.)(.+)(.)$/, (_, first, middle, last) => {
      return first + '*'.repeat(middle.length) + last;
    });
  };

  const handleReviewClick = (id) => {
    router.push(`/review/${id}`);
  };


  return (
    <div className="mt-8 w-full">
      <div className="flex flex-row gap-1 mb-4 text-nowrap flex-wrap">
        {/** 정렬 버튼 */}
        {sorting.map((item, i) => {
          return (
            <button
              onClick={() => handleSortChange(i)}
              className={`border border-neutral-200 rounded shadow px-3 transition-colors ${i === sortNum ? "text-green-500" : ""
                }`}
              key={i}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/** 리뷰 리스트 */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/** 리뷰들 */}
          {isReviewLoad ? (
            Array.from({ length: pageLimit }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 shadow-md rounded-lg px-4 py-1 text-gray-700"
              >
                {/** 스켈레톤 */}
                <div className="flex flex-col gap-1 h-32">
                  {/* 상단 회사명과 유저 이름 */}
                  <div className="flex flex-row w-full gap-2 items-end">
                    <div className="flex flex-col flex-1">
                      <Skeleton height={12} width="50%" />
                      <Skeleton height={16} width="40%" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-row gap-2 text-sm justify-end">
                        <Skeleton height={12} width={40} />
                        <Skeleton height={16} width={40} />
                      </div>
                      <Skeleton height={12} width={80} />
                    </div>
                  </div>

                  {/* 본문 내용 */}
                  <Skeleton height={16} count={2} />
                </div>
              </div>
            ))) : <>
            {reviews.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 shadow-md rounded-lg p-4 text-gray-700
                cursor-pointer hover:bg-gray-200 h-32 overflow-hidden"
                onClick={() => handleReviewClick(item.id)}
              >
                <div className="flex flex-col">
                  <div className="flex flex-row w-full gap-4 items-end">
                    <div className="flex flex-col flex-1">
                      <div className="text-sm text-gray-500">{item.company}</div>
                      <div className="">
                        <span>{maskName(item.name)}</span>
                        <span className="text-sm text-gray-500"> 님</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-row gap-2 text-sm justify-end">
                        <span className="flex items-center">
                          <FaHeart className="text-gray-400 mr-1" />{item.likes_count}
                        </span>
                        <span className="flex items-center">
                          <FaComment className="text-gray-400 mr-1" />{item.comments_count}
                        </span>
                      </div>
                      <Stars num={item.rating} />
                    </div>
                  </div>

                  <div className="overflow-hidden text-ellipsis line-clamp-2">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </>}

        </div>
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            className="px-4 py-2 border rounded-lg bg-gray-white shadow hover:bg-gray-200 disabled:bg-gray-200"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            이전
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-4 py-2 border rounded-lg transition-colors text-gray-700
          ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"}
        `}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            className="px-4 py-2 border rounded-lg bg-gray-white shadow hover:bg-gray-200 disabled:bg-gray-200"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};