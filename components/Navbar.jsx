"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { IoMenu, IoClose } from "react-icons/io5";
import { TbUserEdit } from "react-icons/tb";
import { MdLogin, MdLogout } from "react-icons/md";

const Navbar = () => {
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const refWidth = 768;

  const [isTabOpen, setIsTabOpen] = useState(false);

  const navList = [
    { tag: '광고 현황', route: '/adsState' },
    { tag: '스케줄러', route: '/scheduler' },
    { tag: '회원 리뷰', route: '/review' },
    { tag: '모델 소개', route: '/model' }
  ];

  useEffect(() => {     // 화면 폭 변화를 감지해 isMobile 값 변경
    const handleResize = () => {
      setIsMobile(window.innerWidth < refWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      {!isMobile ? (
        <nav className="h-14 w-full flex items-center justify-between px-8 border-b-2 border-black-800 fixed top-0 z-10 bg-white">
          {/** PC 화면 */}

          {/** 로고 */}
          <Link href='/'>
            <img className="w-10 h-10" src="https://cdn-icons-png.flaticon.com/512/427/427496.png" alt="ChamelNeon" />
          </Link>

          {/** 탭 */}
          <div className="flex flex-1 flex-row px-6 gap-4 h-full">
            {navList.map((ele, idx) => {
              const isActive = pathname === ele.route;
              return (
                <Link href={ele.route} key={idx}>
                  <button
                    className={`h-full flex items-center justify-center px-2 min-w-20 relative 
                  ${isActive ? 'after:bg-green-500' : 'after:bg-transparent hover:after:bg-neutral-300'}
                  after:content-[''] after:w-full after:h-[2px] after:absolute after:bottom-0 after:left-0`}
                  >
                    {ele.tag}
                  </button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center px-3 gap-4 text-xl">
          </div>
        </nav>
      ) : (
        <nav className="h-14 w-full flex items-center justify-between px-4 border-b-2 fixed top-0 z-[101] bg-white">
          {/** 모바일 화면 */}

          {/** 로고 */}
          <Link href='/'>
            <img className="w-10 h-10" src="https://cdn-icons-png.flaticon.com/512/427/427496.png" alt="ChamelNeon" />
          </Link>

          <button
            className="size-12 flex items-center justify-center rounded focus:border-green-500 border-2 border-transparent"
            onClick={() => { setIsTabOpen(!isTabOpen) }}
          >
            {isTabOpen
              ? <div className="text-xl"><IoClose /></div>
              : <div className='text-xl'><IoMenu /></div>}
          </button>

          {/** 하단 버튼 리스트 */}
          {isTabOpen && (
            <div
              className="fixed left-0 top-14 w-screen h-full z-10"
              onClick={() => setIsTabOpen(false)}
            >
              {/** 배경 레이어 */}
              <div className="absolute inset-0 bg-black opacity-25"></div>

              {/** 컨텐츠 레이어 */}
              <div className="relative flex flex-col bg-white w-full text-sm">
                {navList.map((ele, idx) => {
                  const isActive = pathname === ele.route;
                  return (
                    <Link href={ele.route} key={idx}>
                      <button
                        className={`w-full h-10 flex items-center px-4 text-black relative 
            ${isActive ? 'bg-green-100 before:bg-green-500' : 'bg-white before:bg-transparent'}
            before:content-[''] before:w-[2px] before:h-full before:absolute before:left-0`}
                      >
                        {ele.tag}
                      </button>
                    </Link>
                  );
                })}

                <div className="w-full border-b-2 border-slate-200"></div>
              </div>
            </div>
          )}
        </nav>)}
    </>
  );
};

export default Navbar;