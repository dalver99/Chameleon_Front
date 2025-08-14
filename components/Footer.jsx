'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGithub } from 'react-icons/fa';
import { RiSlideshowFill } from "react-icons/ri";
import { FaFileImage } from "react-icons/fa6";

export default function Footer() {
  const router = useRouter();

  const infos = [
    { name: '김기태', role: 'Front-end', contact: 'https://github.com/Gitae-business' },
    { name: '김우현', role: 'Back-end', contact: 'https://github.com/uhyeonkim96' },
    { name: '김선우', role: 'Data Analyst', contact: 'https://github.com/UnoesmiK' },
    { name: '김준영', role: 'PM', contact: 'https://github.com/dalver99' },
    { name: '김진규', role: 'Back-end', contact: 'https://github.com/aivler6th' },
    { name: '이예주', role: 'Back-end', contact: 'https://github.com/yejuda' },
    { name: '성연서', role: 'Back-end', contact: 'https://github.com/yeonseoGit' },
  ];

  return (
    <div className="w-full">
      <div className="px-12 py-8 bg-neutral-800 text-neutral-200">
        <div className="max-w-6xl mx-auto flex lg:flex-row flex-col gap-x-8 gap-y-12 ">
          {/** 소개 */}
          <div className="flex-1 flex flex-col">
            <div className="text-lg font-bold mb-4">ChamelNeon</div>
            <div className="text-sm">AIVLE School 6기 9조의 작품입니다.<span className="text-neutral-800"> 근데 이제 영혼을 갈아넣은...</span></div>
            <div className="flex flex-1 items-center gap-3 min-h-32 max-lg:justify-center">
              {/** 버튼들 */}
              {/* <button> 깃허븐데 안씀
              className="flex items-center justify-center size-10 rounded-full bg-black text-white hover:bg-neutral-900 transition-colors"
              onClick={() => window.open('https://github.com/dalver99/team9_bigproject', '_blank')} // 깃허브 링크로 이동
            >
              <FaGithub size={24} />
            </button> */}
              {/** 원페이저 */}
              <button
                aria-label="OnePager"
                className="flex items-center justify-center size-10 rounded-full bg-black text-white hover:bg-neutral-900 transition-colors"
                onClick={() => window.open(process.env.NEXT_PUBLIC_ONEPAGER_URL, '_blank')}
              >
                <FaFileImage size={18} />
              </button>
              {/** PPT */}
              <button
                aria-label="PPT"
                className="flex items-center justify-center size-10 rounded-full bg-black text-white hover:bg-neutral-900 transition-colors"
                onClick={() => window.open(process.env.NEXT_PUBLIC_PPT_URL, '_blank')}
              >
                <RiSlideshowFill size={20} />
              </button>
            </div>
          </div>
          {/** 조원 */}
          <div className="lg:mr-12 flex-1 overflow-clip overflow-ellipsis">
            <div className="text-lg font-bold mb-4">CONTACT US</div>
            <table className="w-full table-auto text-sm">
              <tbody>
                {infos.map(({ name, role, contact }, idx) => (
                  <tr key={idx} className="text-start">
                    <td className="text-nowrap">{name}</td>
                    <td className="text-nowrap">{role}</td>
                    <td className="text-wrap overflow-clip text-ellipsis">
                      <span
                        className="hover:underline hover:cursor-pointer text-blue-300"
                        onClick={() => window.open(contact, '_blank')}
                      >
                        {contact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="bg-neutral-900 text-neutral-400 px-12 py-4 flex flex-col lg:flex-row justify-center items-center gap-4 text-sm">
        <div className="">© 2025 ChamelNeon. All rights reserved.</div>
        <div className="max-lg:hidden h-4 border-l border-neutral-600"></div>
        <Link href={'/terms/termsncondition'}><div className="hover:underline">이용약관</div></Link>
        <div className="max-lg:hidden h-4 border-l border-neutral-600"></div>
        <Link href={'/terms/personalinfo'}><div className="hover:underline font-bold">개인정보 처리방침</div></Link>
      </div>
    </div>
  );
};