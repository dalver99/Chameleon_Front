'use client'

import { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ImgPlayer({ frames = [] }) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [loadedImgs, setLoadedImgs] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getDisplayImage = (frame) => {
    return frame?.predicted_image_path || frame?.image_path;
  };

  const validFrames = frames.filter(frame => getDisplayImage(frame));

  useEffect(() => {
    if (!isPlaying || validFrames.length <= 1 || isDragging) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % validFrames.length);
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, isDragging]);

  const handleDragStart = (e) => {
    setIsPlaying(false);
    setIsDragging(true);
    handleDragMove(e);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newIndex = Math.floor(validFrames.length * percentage);

    setCurrentFrameIndex(newIndex);
    setDragPosition(percentage * 100);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  if (validFrames.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-4 text-center">
        <p className="text-neutral-500">표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  const currentFrame = validFrames[currentFrameIndex] || {};
  const displayImage = getDisplayImage(currentFrame);
  const currentPosition = (currentFrameIndex / (validFrames.length - 1)) * 100;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const imgsToPreload = validFrames.map(frame => getDisplayImage(frame)).filter(Boolean);
    let loadedCount = 0;

    imgsToPreload.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setLoadedImgs((prev) => ({ ...prev, [url]: true }));
        loadedCount++;
        if (loadedCount === imgsToPreload.length) {
          setIsLoading(false);
        }
      };
    });
  }, [validFrames]);

  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative">
        {isLoading ? (
          <div className="w-full">
           <Skeleton height={400}/>
          </div>
        ) : (
          displayImage && loadedImgs[displayImage] ? (
            <img src={displayImage} alt={`Frame ${currentFrameIndex + 1}`} className='w-full h-auto object-cover' />
          ) : (
            <div className="w-full h-64 bg-neutral-200 flex items-center justify-center">
              이미지 없음
            </div>
          )
        )}

        <div
          className="w-full h-12 bg-neutral-300 relative cursor-pointer"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div
            className="absolute top-0 bottom-0 w-1 bg-blue-500"
            style={{
              left: `${isDragging ? dragPosition : currentPosition}%`
            }}
          />
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
          >
            {isPlaying ? '일시정지' : '재생'}
          </button>

          <div className="text-sm text-neutral-600">
            <p>프레임: {currentFrameIndex + 1} / {validFrames.length}</p>
          </div>
        </div>

        <div className="text-sm flex md:flex-row flex-col gap-x-4 gap-y-1">
          <p className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {currentFrame.name || '정보 없음'}
          </p>
          <p className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {new Date(currentFrame.captured_at).toLocaleString() || '정보 없음'}
          </p>
        </div>
      </div>
    </div>
  );
}

export { ImgPlayer };
