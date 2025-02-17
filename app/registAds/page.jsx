'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const cateList = [
    "Clothing", "Electronics", "Home Appliances", "가전제품(소프트웨어)", "교육",
    "극장/영화관", "기술직업훈련", "병원", "산업", "소매업", "어학원", "여가/오락",
    "유통", "음식/음료", "의료", "패션/뷰티", "행정기관", "기타"
  ];

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState(50000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targets, setTargets] = useState([]);
  const [genders, setGenders] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type.startsWith("image/") || selectedFile.type.startsWith("video/"))) {
      setFile(selectedFile);
    } else {
      alert("Please upload an image or video file.");
    }
  };

  const handleTargetChange = (e) => {
    const value = e.target.value;
    setTargets(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setGenders(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('현재 광고 등록 기능은 프로토타입으로, 실제로 등록되지 않습니다.');
    router.push("/");
  };

  return (
    <div className="">
      <div className="w-full min-h-full py-24 mx-auto max-w-xl px-4 pt-10 pb-8">
        <div className="flex flex-col mb-4">
          <div className="text-2xl font-bold">광고 등록</div>
          <div className="">광고 등록을 위해 자세한 정보를 입력해주세요.</div>
        </div>

        <form className="flex flex-col p-2 gap-4" onSubmit={handleSubmit}>
          {/** 제목 */}
          <div className="flex flex-col">
            <input
              id="adTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="광고 제목을 입력하세요"
              className="border border-gray-200 rounded h-10 px-2 focus:outline-none focus:ring-0"
            />
          </div>

          {/** 파일 */}
          <div className="flex flex-col">
            <input
              id="adFile"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="py-1 border border-gray-200 rounded h-10 px-2 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="border-b border-neutral-300 my-1 w-full"></div>

          {/** 카테고리 */}
          <div className="flex flex-col">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-200 rounded h-10 px-2 focus:outline-none focus:ring-0"
            >
              <option value="">카테고리를 선택하세요</option>
              {cateList.map((name, idx) => (
                <option value={name} key={idx}>{name}</option>
              ))}
            </select>
          </div>

          {/** 예산 */}
          <div className="flex flex-row items-center gap-3 w-full">
            <input
              id="budget"
              type="number"
              value={budget}
              step={1000}
              min={10000}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="예산을 입력하세요"
              className="flex-1 text-end border border-gray-200 rounded h-10 px-2 focus:outline-none focus:ring-0"
            />
            원
          </div>

          {/** 날짜 */}
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 border border-gray-200 rounded h-10 px-2 focus:outline-none focus:ring-0"
              />
              <p className="text-sm mr-2">시작</p>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 border border-gray-200 rounded h-10 px-2 focus:outline-none focus:ring-0"
              />
              <p className="text-sm">종료</p>
            </div>
          </div>
          
          <div className="border-b border-neutral-300 my-1 w-full"></div>
          
          {/** 연령 */}
          <div className="flex flex-col">
            <label className="mb-2 text-blue-500 font-bold">타겟층 연령대</label>
            <div className="grid grid-cols-3 gap-2">
              {["10대", "20대", "30대", "40대", "50대", "60대 이상"].map((age) => (
                <div key={age} className="flex items-center">
                  <input
                    type="checkbox"
                    id={age}
                    value={age}
                    checked={targets.includes(age)}
                    onChange={handleTargetChange}
                    className="mr-2"
                  />
                  <label htmlFor={age}>{age}</label>
                </div>
              ))}
            </div>
          </div>

          {/** 성별 */}
          <div className="flex flex-col">
            <label className="mb-2 text-blue-500 font-bold">타겟 성별</label>
            <div className="grid grid-cols-3 gap-2">
              {["남성", "여성"].map((gender) => (
                <div key={gender} className="flex items-center">
                  <input
                    type="checkbox"
                    id={gender}
                    value={gender}
                    checked={genders.includes(gender)}
                    onChange={handleGenderChange}
                    className="mr-2"
                  />
                  <label htmlFor={gender}>{gender}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="flex-1 text-white bg-blue-600 rounded py-2 hover:bg-blue-700"
            >
              광고 등록하기
            </button>
            <button
              type="button"
              onClick={() => {
                if (!confirm("작성을 취소할까요? 입력된 정보는 저장되지 않습니다.")) return;
                router.back();
              }}
              className="rounded border border-gray-300 px-7 py-2 bg-white hover:bg-gray-200"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
