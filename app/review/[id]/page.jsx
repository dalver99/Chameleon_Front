'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Stars } from "@/components/review/reviewUi";

import { FaHeart, FaComment } from 'react-icons/fa';
import { HiOutlineTrash } from "react-icons/hi";

import { MoonLoader } from "react-spinners";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ReviewDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [isLoad, setIsLoad] = useState(false);
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);

  const [cont, setCont] = useState("");
  const [comments, setComments] = useState([]);
  const [isLike, setIsLike] = useState(false);
  const [isComLoad, setIsComLoad] = useState(false);

  useEffect(() => {
    // 리뷰 내용 패치
    const fetchPost = async () => {
      try {
        setIsLoad(true);
        const res = await fetch(`/api/review/${id}`);

        if (res.ok) {
          const data = await res.json();
          setReview(data);
        } else {
          const errorData = await res.json();
          setError(errorData.error || "Failed to fetch post");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoad(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // 내 글 여부 확인
  const isMine = false;


  // 이름 마스킹
  const maskName = (name) => {
    return name.replace(/^(.)(.+)(.)$/, (_, first, middle, last) => {
      return first + '*'.repeat(middle.length) + last;
    });
  };

  // 공감 버튼 토글
  const handleLike = async () => {
    setIsLike(!isLike);
  };


  // 댓글 등록
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (cont.length <= 0) {
      alert('댓글이 입력되지 않았습니다.');
      return;
    }

    if (!confirm('댓글을 등록할까요?')) return;

    alert('댓글이 등록되었습니다.');
  };


  // 댓글 입력 관리. 300자 제한
  const handleCommentInput = (e) => {
    if (e.target.value.length > 300) return;
    setCont(e.target.value);
  };

  // 출력
  if (isLoad) {
    return (
      <div className="p-8">
        <div className="space-y-2">
          <Skeleton height={45} width="100%" />
        </div>
        <div className="space-y-2">
          <Skeleton height={350} width="100%" />
        </div>
      </div>
    );
  }

  if (review == null) {
    return <div className="text-center h-full mt-32">리뷰를 찾을 수 없습니다.</div>
  }

  if (review.status == 'hidden') {
    return <div className="">리뷰가 숨겨진 상태입니다.</div>
  } else if (review.status == 'deleted') {
    return <div className="">리뷰가 삭제되었습니다.</div>
  }

  return (
    <div className="p-5 flex flex-col gap-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center pt-4">
        리뷰 상세
      </h1>

      <div className="border border-neutral-200 rounded-lg p-6">
        <div className="w-full flex flex-row justify-between">
          <div className="flex-1">
            <div className="text-sm text-gray-500">[{review.company}]</div>
            <div>{maskName(review.name)} 님</div>
          </div>
          <div className="flex flex-col items-end">
            <Stars num={review.rating} />
            <div className="flex flex-row items-center gap-2 text-sm">
              <div className="flex flex-row items-center justify-end ml-auto gap-1">
                <div className="text-gray-400"><FaHeart /></div>
                <div className="">{review.likes || 0}</div>
              </div>
              <div className="flex flex-row items-center gap-1">
                <div className="text-gray-400"><FaComment /></div>
                <div className="">{comments.length}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {(review.updated_at > review.created_at)
                ? `${new Date(review.updated_at).toLocaleString()} 수정`
                : `${new Date(review.created_at).toLocaleString()} 작성`}

            </div>
          </div>
        </div>

        <div className="w-full border-b my-6"></div>

        <div className="mb-8">{review.content}</div>
        <button
          className={`mx-auto size-16 flex items-center justify-center rounded-full border hover:bg-gray-200
            text-xl ${isLike ? "text-red-500" : "text-gray-300"}`}
          type="button"
          onClick={handleLike}
        >
          <FaHeart />
        </button>
        <div className="ml-auto w-fit text-gray-500 hover:underline hover:cursor-pointer"
          onClick={() => { router.push(`/dashboard/${review.ad_id}`) }}>
          해당 광고의 대시보드로 이동하기
        </div>
      </div>

      {/** 댓글 */}
      <div className="border border-neutral-200 rounded-lg p-6">
        {/** 댓글 달기 */}
        <form
          onSubmit={handleCommentSubmit}
          className="flex flex-row gap-2 w-full"
        >
          <div className="flex-1 flex flex-row gap-2 border rounded px-2 py-1">
            <input
              value={cont}
              onChange={handleCommentInput}
              placeholder="댓글 작성하기"
              className="flex-1 focus:outline-none"
            />
            <div className="text-sm text-gray-500">
              {cont.length}/300
            </div>
          </div>
          <button
            type="submit"
            className="rounded px-4 text-white bg-blue-500 hover:bg-blue-600"
          >
            등록
          </button>
        </form>

        {/** 리스트 */}
        <div className="flex flex-col gap-1 mt-4">
          {isComLoad ? (
            <MoonLoader />
          ) : (comments.length > 0) ? (
            comments.map((com) => {
              return (
                <div className="border-b py-4" key={com.id}>
                  <div className="flex justify-between w-full mb-2">
                    <span className="font-semibold">{maskName(com.name)} <span className="text-sm text-gray-500">님</span></span>
                    <div className="flex items-center gap-2 justify-center">
                      <span className="text-gray-500 text-sm">{new Date(com.created_at).toLocaleString()}</span>
                      <button
                        onClick={e => handleCommentDelete(e, com.id)}
                        className="size-4 flex items-center justify-center text-red-400 hover:bg-gray-300 rounded-full"
                        type="button">
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-700">
                    {com.content}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-neutral-500 text-center py-8">댓글이 없습니다.</div>
          )}

        </div>
      </div>


    </div>
  );
}
