'use client'

import { useRouter } from 'next/navigation';
import React from 'react';
import { FaHeart, FaComment } from 'react-icons/fa';

const ReviewCard = ({ data }) => {
  const router = useRouter();
  const { company, name, rating, likes_count, comments_count, content, id } = data;

  const maskName = (name) => {
    return name.replace(/^(.)(.+)(.)$/, (_, first, middle, last) => {
      return first + '*'.repeat(middle.length) + last;
    });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 w-full h-80 border border-gray-200 text-end flex flex-col overflow-clip"
      onClick={() => router.push(`/review/${id}`)}
    >
      <div className="w-full flex flex-row">
        <div className="flex-1"></div>
        <Stars num={rating} />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <h2 className="text-lg font-bold mb-1">{company}</h2>
        <p className="text-sm text-gray-600 mb-6">{maskName(name)} 님</p>
        <p className="text-base mb-3 flex-1 text-gray-500 w-full text-start overflow-hidden text-ellipsis line-clamp-3">
          {content}
        </p>
      </div>
      <div className="flex justify-end gap-4 text-sm">
        <span className="flex items-center">
          <FaHeart className="text-gray-400 mr-1" /> {likes_count}
        </span>
        <span className="flex items-center">
          <FaComment className="text-gray-400 mr-1" /> {comments_count}
        </span>
      </div>
    </div>
  );
};

// 별 개수
const Stars = ({ num }) => {
  const n = Math.round(num);

  return (
    <div className="flex flex-row gap-1">
      {[...Array(n)].map((_, i) => (
        <div className="text-yellow-400" key={i}>
          ★
        </div>
      ))}
      {[...Array(5 - n)].map((_, i) => (
        <div className="text-gray-300" key={i}>
          ★
        </div>
      ))}
    </div>
  );
};

export { ReviewCard, Stars };
