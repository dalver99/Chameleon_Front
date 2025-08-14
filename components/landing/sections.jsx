'use client'

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from "next/image";
import { ReviewCard } from "../review/reviewUi";

const Section1 = () => {
  const router = useRouter();
  const imgRef = useRef(null);
  const [color, setColor] = useState("#000000");

  const [code, setCode] = useState("");
  const [isCodeActive, setIsCodeActive] = useState(false);

  // 이벤트 리스너로 키보드 입력 관리. Q가 3번 연속으로 입력되면 code 초기화 및 isCodeActive 반전
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toUpperCase() === "Q") {
        setCode((prevCode) => prevCode + "Q");

        if (code === "QQ") {
          setCode("");
          setIsCodeActive((prev) => !prev);
          imgRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setCode("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [code]);

  const handleClick = (e) => {
    e.preventDefault();

    router.push('/registAds');
  };

  const getRandColor = () => {
    // 랜덤한 색상(Hue) 생성 (0-360)
    const hue = Math.floor(Math.random() * 360);
    // 높은 채도(Saturation) 설정 (80-100%)
    const saturation = Math.floor(Math.random() * 21) + 80;
    // 중간 명도(Lightness) 설정 (40-60%)
    const lightness = Math.floor(Math.random() * 21) + 40;

    // HSL을 RGB로 변환
    const hslToRgb = (h, s, l) => {
      h /= 360;
      s /= 100;
      l /= 100;
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  useEffect(() => { // 2초마다 랜덤한 색상을 설정
    const interval = setInterval(() => {
      setColor(getRandColor());
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex flex-col items-center gap-4 lg:gap-8 px-4 sm:px-8 py-8 sm:py-12">
      {/** 팀 이름 */}
      <div className="rounded-full px-4 bg-neutral-300 font-bold text-sm sm:text-base">
        AIVLE 6기 9조
      </div>

      {/** 타이틀 */}
      <div className="font-bold flex flex-col items-center justify-center 
      text-5xl sm:text-5xl lg:text-6xl text-start sm:text-center text-nowrap">
        <div className="sm:hidden">오프라인 광고도</div>
        <div className="hidden sm:block">이제는 오프라인 광고도</div>
        <div className="flex flex-row">
          <div 
          className="text-green-700"
          style={{
            //color: color,
            transition: 'color 2s ease',
          }}>변화</div>
          <div className="">가 필요한 순간</div>
        </div>
      </div>

      {/** 설명 */}
      <div className="text-center text-sm max-sm:mt-4 max-sm:mx-8 sm:text-base lg:text-lg">
        ChamelNeon은 항상 고객들의 시간과 비용을 최우선으로 생각합니다. <br className="hidden sm:block" />
        AI 기술을 사용해 개별적인 광고 집행에 있어 최적의 솔루션을 찾아 제공합니다. <br className="hidden sm:block" />
        완벽히 맞춤화되고 자동화된 놀라운 광고 서비스를 경험해보세요.
      </div>

      {/** 버튼 */}
      <div className="flex flex-col sm:flex-row w-full max-w-3xl items-center justify-between gap-2
       sm:gap-6 mt-8 shadow border border-neutral-100 py-2 px-3 sm:px-6 rounded">
        <div className="text-base sm:text-lg lg:text-xl font-bold text-center sm:text-left">
          광고를 의뢰하고 차별화된 서비스를 경험해보세요.
        </div>
        <button
          className="text-base sm:text-md lg:text-lg font-bold px-4 sm:px-6 py-1 bg-emerald-300 rounded hover:bg-emerald-400 whitespace-nowrap transition-colors"
          onClick={handleClick}
          type="button"
        >
          광고 등록하기
        </button>
      </div>

      {/** gif */}
      <div className="mt-5 w-full max-w-5xl h-fit shadow-[0_0_45px_10px_rgba(34,197,94,0.5)]" ref={imgRef}>
        <Image
            src="/landing-png.png"
            alt=""
            className="w-full h-auto object-cover"
            width={1200}
            height={800}
            unoptimized
          />
        {/* {!isCodeActive ? (
          <Image
            src="/landing-image.gif"
            alt=""
            className="w-full h-auto object-cover"
            width={1200}
            height={800}
            unoptimized
          />
        ) : (
          <img
            src={"https://i.imgur.com/miHDSxC.jpg"}
            alt="AIVLE School 6기 9조 이정하패밀리"
            className="w-full h-auto object-cover"
          />
        )} */}

      </div>

      <div
        className="text-center px-4 hover:bg-neutral-200 rounded-full py-1 text-green-700 cursor-pointer font-bold transition-colors"
        onClick={() => router.push('/model')}
      >
        {isCodeActive ? "AIVLE School 6기 9조 [이정하패밀리] with 매니저 이정하" : "모델 사용해보기"}
      </div>
    </div>
  );
};


const Section2 = () => {

  const items = [
    {
      number: 1,
      title: "광고 등록",
      description: "광고 내용과 주제, 기간, 예산, 타겟층을 설정하세요.",
      color: "bg-emerald-500",
      img: "/land1.svg"
    },
    {
      number: 2,
      title: "광고 집행",
      description: "입력하신 정보와 실시간 데이터로 AI가 광고를 집행해요.",
      color: "bg-blue-500",
      img: "/land2.svg"
    },
    {
      number: 3,
      title: "성과 분석",
      description: "광고 진행 중 수집된 데이터를 분석합니다.",
      color: "bg-yellow-500",
      img: "/land3.svg"
    },
    {
      number: 4,
      title: "리뷰",
      description: "수집 데이터를 통해 직관적인 통계를 제공합니다.",
      color: "bg-red-500",
      img: "/land4.svg"
    },
  ];

  return (
    <div className="relative w-screen">
      {/* 상단 제목 */}
      <div className="text-center bg-emerald-200 w-screen py-8 font-bold text-4xl md:text-5xl text-nowrap overflow-hidden">
        ChamelNeon은<br />
        이런 서비스를 제공해요
      </div>

      {/* 리스트 요소 */}
      <div className="flex flex-col items-center mx-auto px-12 py-12 space-y-16">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center w-full max-w-lg"
            initial={{ scale: 1, opacity: 0.8 }}
            whileInView={{ scale: 1.1, opacity: 1 }}
            viewport={{ once: false, margin: "-40% 0% -40% 0%" }}
            transition={{ duration: 0.3 }}
          >
            {/* 기본 정보 */}
            <div className="flex flex-row items-center justify-start gap-4 w-full mb-4">
              <div className="rounded-full size-12 bg-neutral-300 flex items-center justify-center text-lg font-bold">
                {item.number}
              </div>
              <div className="flex flex-col flex-1 overflow-visible">
                <div className="text-2xl font-bold">{item.title}</div>
                <div className="text-sm text-neutral-700">{item.description}</div>
              </div>
            </div>

            {/* 확장되는 박스 */}
            <motion.div
              className={`${item.color} w-full rounded-lg overflow-hidden flex items-center justify-center`}
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: "18rem", opacity: 1 }}
              viewport={{ once: false, margin: "-20% 0% -20% 0%" }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={item.img}
                alt={item.title}
                width={index == 3 ? 400 : 300}
                height={300}
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


const Section3 = () => {
  const items = [
    {
      q: "광고를 어디에 해야 하지?",
      a: "ChamelNeon과 함께라면 광고 집행을 위해 조사하고 분석할 필요가 없어요. AI가 똑똑하게 광고가 가장 효과적으로 노출될 시간과 지역을 판단해 서울 전역에 배치된 전광판에서 광고를 송출해 줄 거에요.",
    },
    {
      q: "광고를 하려면 예산이 많이 필요할텐데...",
      a: "비싼 광고비가 걱정이셨죠? CamelNeon에서는 광고에 사용할 금액도 자유롭게 설정할 수 있어요. AI가 설정한 기간과 금액만큼 최대한의 효율로 광고를 진행해 줄 거에요.",
    },
    {
      q: "광고가 제대로 되고 있는건가?",
      a: "기존의 오프라인 광고들은 성과를 분석하기 어려우셨죠? 저희는 AI를 활용한 다양한 지표들과 평가들을 실시간으로 제공해요. 통계를 통해 유동적으로 광고 전략을 수정하는 것도 가능해요.",
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 50 }, // 시작 상태: 투명하고 아래로 이동
    visible: { opacity: 1, y: 0 }, // 화면에 등장 시: 불투명하고 원래 위치로
  };

  return (
    <div className="w-screen py-16 px-6">
      {/** 소제목 */}
      <div className="font-bold text-center text-3xl sm:text-5xl mb-24">
        <p>광고 맡기시는 고객님!</p>
        <p>이런 고민 <br className="sm:hidden" />한번쯤은 해보셨죠?</p>
      </div>

      {/** 내용 */}
      <div className="flex flex-col w-full items-center max-w-3xl gap-20 mx-auto">
        {items.map((item, idx) => (
          <div className="flex flex-col w-full gap-6 text-lg" key={idx}>
            {/** 질문 박스 */}
            <motion.div
              className={`bg-blue-100 text-gray-800 font-bold px-6 py-3 rounded-lg shadow-md w-fit`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={itemVariants}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              {item.q}
            </motion.div>

            {/** 답변 박스 */}
            <motion.div
              className={`self-end bg-purple-100 text-gray-800 px-6 py-3 rounded-lg shadow-md max-w-lg`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={itemVariants}
              transition={{ duration: 0.5, delay: idx * 0.2 + 0.1 }}
            >
              {item.a}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};


const Section4 = () => {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();

    router.push('/registAds');
  };

  const reviews = [
    {
      "id": 9,
      "content": "이 서비스를 사용하면서 가장 좋았던 점은 다양한 통계와 데이터를 제공해 준다는 거예요. 광고 성과를 구체적인 수치로 확인할 수 있어 전략을 조정하는 데 매우 유용했습니다. 실시간 통계를 통해 어떤 부분이 잘 되고 있는지, 또 어떤 부분을 개선해야 하는지 명확하게 파악할 수 있었죠.\n\n또한, 피드백이 정말 빠르고 친절했습니다. 질문을 드리면 언제나 신속하게 답변을 주셔서 광고 진행 중에 걱정이 없었고, 필요한 사항을 꼼꼼히 체크해 주셔서 더욱 신뢰할 수 있었습니다. 다양한 데이터와 빠른 피드백 덕분에 광고 운영이 훨씬 더 원활하고 효율적으로 진행될 수 있었어요!",
      "author_id": 8,
      "ad_id": 93,
      "rating": 5,
      "created_at": "2025-02-03T20:36:26.000Z",
      "updated_at": "2025-02-03T20:36:26.000Z",
      "status": "active",
      "name": "김준영",
      "company": "이정하컴퍼니",
      "likes_count": 64,
      "comments_count": 6
    },
    {
      "id": 8,
      "content": "저처럼 영세한 기업에서도 큰 예산이나 많은 인적 자원을 투자하지 않고도 이 서비스를 간편하게 이용할 수 있다는 점이 정말 좋았습니다. 복잡한 설정이나 추가 비용 없이, 필요한 만큼만 예산을 투입하면 효율적으로 광고를 집행할 수 있어요. 대행사에서 제공하는 데이터 기반의 최적화 덕분에, 적은 자원으로도 높은 효과를 볼 수 있었습니다.\n\n서비스 자체가 직관적이고 사용하기 쉬워서, 전담 인력을 두지 않은 작은 기업에서도 부담 없이 활용할 수 있어요. 앞으로도 지속적으로 이용하고 싶은 서비스입니다!",
      "author_id": 27,
      "ad_id": 5,
      "rating": 4,
      "created_at": "2025-02-03T20:35:31.000Z",
      "updated_at": "2025-02-03T20:35:31.000Z",
      "status": "active",
      "name": "김선우",
      "company": "이정하컴퍼니",
      "likes_count": 152,
      "comments_count": 12
    },
    {
      "id": 7,
      "content": "광고 예산을 어떻게 써야 할지 늘 고민이었는데, 이 대행사를 이용하고 나서 그런 걱정이 확 줄었습니다. 주어진 예산 내에서 최대한의 효율을 뽑아내는 방식으로 광고를 집행해 주다 보니, 불필요한 지출 없이도 높은 성과를 낼 수 있었어요. AI를 활용한 최적화 덕분인지 클릭률과 전환율도 눈에 띄게 좋아졌습니다.\n\n또 한 가지 마음에 들었던 점은 계약을 연장하는 게 부담스럽지 않다는 거예요. 처음에는 짧게 테스트해 보려고 했는데, 성과가 기대 이상으로 나오다 보니 자연스럽게 연장을 결정하게 됐어요. 예산 대비 효과적인 광고를 찾고 있다면 정말 추천할 만한 서비스입니다!",
      "author_id": 31,
      "ad_id": 92,
      "rating": 5,
      "created_at": "2025-02-03T20:23:55.000Z",
      "updated_at": "2025-02-03T20:23:55.000Z",
      "status": "active",
      "name": "김우현",
      "company": "이정하컴퍼니",
      "likes_count": 41,
      "comments_count": 4
    },
    {
      "id": 6,
      "content": "이 대행사의 대시보드는 정말 직관적이고 유용합니다. 광고 성과를 한눈에 볼 수 있도록 간단한 통계를 제공해 주는데, 복잡한 데이터 없이도 핵심 지표를 쉽게 파악할 수 있어서 너무 편리해요.\n\n특히 마음에 들었던 건 실시간 이미지 슬라이드 기능입니다. 광고가 실제로 노출되는 현장을 이미지로 확인할 수 있어서 어떤 환경에서 광고가 집행되는지 바로 알 수 있더라고요. 덕분에 필요할 때마다 전략을 빠르게 조정할 수 있었고, 성과 분석도 훨씬 쉬워졌어요.\n\n깔끔한 UI와 직관적인 디자인 덕분에 사용하기도 편하고, 실시간 데이터를 활용한 인사이트 제공이 뛰어난 대시보드였습니다. 광고 운영하는 분들이라면 꼭 한 번 써볼 만한 서비스예요!",
      "author_id": 33,
      "ad_id": 95,
      "rating": 5,
      "created_at": "2025-02-03T20:21:48.000Z",
      "updated_at": "2025-02-03T20:21:48.000Z",
      "status": "active",
      "name": "이예주",
      "company": "이정하컴퍼니",
      "likes_count": 45,
      "comments_count": 7
    },
    {
      "id": 5,
      "content": "다른 광고 대행사도 여러 곳 경험해봤지만, 여기처럼 AI 기반으로 정교하게 타겟팅해주는 곳은 처음이었습니다. 단순히 광고를 집행하는 게 아니라, 실시간으로 광고를 보는 사람들의 통계를 분석하고 그에 맞춰 최적화해 주는 게 정말 인상적이었어요. 덕분에 광고 효율도 눈에 띄게 좋아졌고, 불필요한 예산 낭비도 줄일 수 있었습니다.\n\n특히, AI가 제공하는 인사이트 덕분에 광고 전략을 수정하는 과정도 훨씬 수월했습니다. 기존에는 대략적인 추측으로 진행했던 부분들이 이제는 데이터 기반으로 명확하게 판단할 수 있게 됐어요. 담당자분들도 피드백을 빠르게 반영해 주셔서 전반적인 경험이 굉장히 만족스러웠습니다. 앞으로도 계속 함께하고 싶은 대행사입니다!",
      "author_id": 22,
      "ad_id": 91,
      "rating": 5,
      "created_at": "2025-02-03T20:19:17.000Z",
      "updated_at": "2025-02-03T20:19:17.000Z",
      "status": "active",
      "name": "성연서",
      "company": "이정하컴퍼니",
      "likes_count": 112,
      "comments_count": 5
    },
  ]

  return (
    <div className="flex flex-col gap-8 items-center bg-emerald-100 pt-12 pb-20">
      <div className="text-4xl font-bold">고객님들의 솔직한 리뷰</div>
      <div className="text-center">ChamelNeon의 서비스를 경험하신 <br className="sm:hidden" />고객님들의 솔직한 리뷰입니다.</div>

      <div className="w-full mb-20 py-3">
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
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx} className="min-w-[300px] max-w-[550px] h-fit py-1">
              <ReviewCard data={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>


      {/** 중앙에 위치하는 광고 안내 박스 */}
      <div
        className="flex flex-col sm:flex-row w-full max-w-2xl items-center justify-between gap-x-6 gap-y-2 
        px-9 py-3 bg-emerald-300 sm:rounded shadow-md"
      >
        <div className="text-lg text-center sm:text-left font-bold">
          광고를 등록하고 <br className="sm:hidden" />차별화된 서비스를 경험해보세요.
        </div>
        <button
          className="font-bold px-4 py-1 rounded bg-white hover:bg-neutral-200 whitespace-nowrap transition-colors"
          onClick={handleClick}
          type="button"
        >
          광고 등록하기
        </button>
      </div>
    </div>
  );
};


export { Section1, Section2, Section3, Section4 };