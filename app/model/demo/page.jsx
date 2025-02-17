"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PieChart } from "@/components/boardUi";
import Brick from "@/components/Brick";
import { BarLoader } from "react-spinners";

export default function Demo() {
  const [image, setImage] = useState(null);
  const [selection, setSelection] = useState({
    left: 0.25,
    top: 0.25,
    right: 0.75,
    bottom: 0.75,
  });
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });

  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState(null);

  const [isLoad, setIsLoad] = useState(false);
  const [output, setOutput] = useState(null);

  const imageRef = useRef(null);
  const selectionRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setSelection({ left: 0.25, top: 0.25, right: 0.75, bottom: 0.75 });
        const img = new Image();
        img.onload = () => {
          setOriginalSize({ width: img.width, height: img.height });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };


  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageDelete = () => {
    if (!confirm("선택된 이미지를 제거합니다.")) return;
    setImage(null);
    setSelection({ left: 0.25, top: 0.25, right: 0.75, bottom: 0.75 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startResize = useCallback((e, handle) => {
    e.preventDefault();
    setIsResizing(true);
    setActiveHandle(handle);
  }, []);

  const handleResize = useCallback(
    (e) => {
      if (!isResizing || !imageRef.current) return;

      const imageRect = imageRef.current.getBoundingClientRect();
      let clientX, clientY;

      if (e.type.startsWith("touch")) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = Math.max(
        0,
        Math.min(1, (clientX - imageRect.left) / imageRect.width)
      );
      const y = Math.max(
        0,
        Math.min(1, (clientY - imageRect.top) / imageRect.height)
      );

      setSelection((prev) => {
        let newSelection = { ...prev };

        switch (activeHandle) {
          case "topLeft":
            newSelection.left = Math.min(x, prev.right - 0.1);
            newSelection.top = Math.min(y, prev.bottom - 0.1);
            break;
          case "topRight":
            newSelection.right = Math.max(x, prev.left + 0.1);
            newSelection.top = Math.min(y, prev.bottom - 0.1);
            break;
          case "bottomLeft":
            newSelection.left = Math.min(x, prev.right - 0.1);
            newSelection.bottom = Math.max(y, prev.top + 0.1);
            break;
          case "bottomRight":
            newSelection.right = Math.max(x, prev.left + 0.1);
            newSelection.bottom = Math.max(y, prev.top + 0.1);
            break;
        }

        return newSelection;
      });
    },
    [isResizing, activeHandle]
  );

  const stopResize = useCallback(() => {
    setIsResizing(false);
    setActiveHandle(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      const handleTouchMove = (e) => {
        e.preventDefault();
        handleResize(e);
      };

      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", stopResize);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", stopResize);

      return () => {
        window.removeEventListener("mousemove", handleResize);
        window.removeEventListener("mouseup", stopResize);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", stopResize);
      };
    }
  }, [isResizing, handleResize, stopResize]);

  // API 호출
  const handleApiCall = async () => {
    if (!image) {
      alert("이미지를 업로드해주세요.");
      return;
    }
  
    try {
      setIsLoad(true);
      window.scrollTo({ top: 0 });
  
      const file = fileInputRef.current.files[0];
      if (!file) {
        alert("파일이 없습니다.");
        setIsLoad(false);
        return;
      }
  
      const { width, height } = originalSize;
  
      const x1 = selection.left * width;
      const y2 = selection.top * height;
      const x2 = selection.right * width;
      const y1 = selection.bottom * height;
  
      // FormData 사용
      const formData = new FormData();
      formData.append("file", file);
      formData.append("x1", x1);
      formData.append("y1", y1);
      formData.append("x2", x2);
      formData.append("y2", y2);
  
      const response = await fetch("/api/demo", {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(60000),
      });
  
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }
  
      const data = await response.json();
      setOutput(data);
    } catch (error) {
      console.error("API 호출 에러:", error);
    } finally {
      setIsLoad(false);
    }
  };
  

  // 결과 지우기
  const handleResetImg = () => {
    setImage(null);
    setOutput(null);
    setSelection({ left: 0.25, top: 0.25, right: 0.75, bottom: 0.75 });
  };

  // 로딩 스켈레톤
  if (isLoad) {
    return (
      <div className="">
        <div
          className="absolute font-bold text-lg w-full top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 text-neutral-600 text-center flex flex-col items-center gap-2 pointer-events-none "
        >
          <div className="animate-pulse">이미지를 모델에 적용하고 있어요.<br />잠시만 기다려주세요.</div>
          <BarLoader width={120}/>
        </div>
        <Brick />
      </div>
    );
  }

  // 결과창 출력
  if (output) {
    return (
      <div className="p-4 lg:px-12 w-full max-w-6xl mx-auto">
        {/** 타이틀 */}
        <div className="flex sm:flex-row flex-col w-full justify-between sm:items-end mb-2 mt-6">
          <div className="flex flex-col">
            <div className="font-bold text-2xl ">DEMO</div>
            <div className="text-neutral-700">
              이미지 파일을 업로드하여 모델을 구동해보세요.
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetImg}
            className="text-white bg-blue-500 hover:bg-blue-600 px-4 mb-1 py-1 rounded-full max-sm:mt-6"
          >
            다른 이미지 입력
          </button>
        </div>

        <div className="w-full border-b my-2"></div>

        {/** 이미지 */}
        <div className="mb-6">
          <img
            src={output.img_path}
            alt="output_img"
            className="w-full h-auto object-cover"
          />
        </div>
        {/** 응시 정보 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="w-full border-b my-2"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            응시자 정보
          </h3>
          {output.gazes.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-2">
              <PieChart title="성별 분포" sub="성별" data={output.stats} />
              <PieChart title="연령대 분포" sub="연령대" data={output.stats} />
              <PieChart title="응시 여부" sub="응시 여부" data={output.stats} />
            </div>
          ) : (
            <div className="text-sm py-6 text-center text-neutral-700">
              응시자가 예측되지 않았어요.
            </div>
          )}
        </div>
      </div>
    );
  }
  // 이미지 입력창
  return (
    <div className="w-full max-w-6xl flex flex-col justify-center p-4 lg:px-12 mx-auto">
      {/** 타이틀 */}
      <div className="flex md:flex-row flex-col w-full justify-between md:items-end">
        <div className="flex flex-col pt-6">
          <div className="font-bold text-2xl ">DEMO</div>
          <div className="text-neutral-700">
            이미지 파일을 업로드하여 모델을 구동해보세요.
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          ref={fileInputRef}
        />
        <div className="mt-2">
          {image ? (
            <button
              type="button"
              onClick={handleImageDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-full"
            >
              이미지 삭제
            </button>
          ) : (
            <button
              type="button"
              onClick={handleUploadClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 max-md:w-full rounded-full"
            >
              이미지 업로드
            </button>
          )}
        </div>
      </div>

      <div className="w-full border-b my-4"></div>

      {/** 이미지 */}
      {image ? (
        <div className="relative inline-block mx-auto mb-12">
          <style jsx>{`
            img {
              -webkit-user-drag: none;
              user-drag: none;
              -webkit-user-select: none;
              user-select: none;
            }
          `}</style>
          <img
            src={image}
            alt="Uploaded"
            ref={imageRef}
            className="w-full max-h-[70vh]"
          />
          <div
            ref={selectionRef}
            style={{
              position: "absolute",
              left: `${selection.left * 100}%`,
              top: `${selection.top * 100}%`,
              width: `${(selection.right - selection.left) * 100}%`,
              height: `${(selection.bottom - selection.top) * 100}%`,
              border: "4px solid orange",
              boxSizing: "content-box",
              zIndex: 5
            }}
          >
            {["topLeft", "topRight", "bottomLeft", "bottomRight"].map(
              (handle) => (
                <div
                  key={handle}
                  className="absolute w-4 h-4 bg-white border-2 border-orange-500 rounded-full"
                  style={{
                    cursor: handle.includes("left")
                      ? "nwse-resize"
                      : "nesw-resize",
                    left: handle.includes("Left") ? "-8px" : "auto",
                    right: handle.includes("Right") ? "-8px" : "auto",
                    top: handle.includes("top") ? "-8px" : "auto",
                    bottom: handle.includes("bottom") ? "-8px" : "auto",
                  }}
                  onMouseDown={(e) => startResize(e, handle)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    startResize(e, handle);
                  }}
                />
              )
            )}
          </div>

          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-1 w-full"
            onClick={handleApiCall}
          >
            적용하기
          </button>
        </div>
      ) : (
        <div
          onClick={handleUploadClick}
          className="w-full h-screen max-h-[30vh] text-sm flex items-center justify-center text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded-lg cursor-pointer"
        >
          클릭해서 이미지를 업로드하세요.
        </div>
      )}
    </div>
  );
}
