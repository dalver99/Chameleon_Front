import React, { useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts';


// 텍스트박스
const TextStatBox = ({ title, mainText, subText }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm
     w-full hover:bg-neutral-200 transition-all duration-100">
      <div className="px-6 py-4 flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="tracking-tight text-sm font-bold">
          {title}
        </div>
      </div>
      <div className="px-6 py-4 pt-0">
        <div className="text-xl font-bold">
          {mainText}
        </div>
        <div className="text-xs text-muted-foreground">
          {subText}
        </div>
      </div>
    </div>
  );
};

// 꺾은선차트
const LineChart = ({ yesterday, today }) => {
  const chartRef = useRef(null);

  // 그래프 초기화
  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["오늘", "어제"],
        bottom: 10,
      },
      xAxis: {
        type: "category",
        data: Object.keys(yesterday),
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value}",
        },
      },
      series: [
        {
          name: "오늘",
          type: "line",
          data: Object.keys(yesterday).map((key) => today[key] ?? null),
          itemStyle: {
            color: "darkblue",
          },
          lineStyle: {
            color: "darkblue",
          },
        },
        {
          name: "어제",
          type: "line",
          data: Object.values(yesterday),
          itemStyle: {
            color: "skyblue",
          },
          lineStyle: {
            color: "skyblue",
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    // 차트 크기 조정을 위해 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 cleanup
    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [yesterday, today]);

  return (
    <div>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

// 파이차트
const PieChart = ({ title, sub, data }) => {
  const chartRef = useRef(null);

  // 연령대별 색상 지정 함수
  const getAgeGroupColor = (group) => {
    const colors = {
      '10미만': '#E3F2FD',   // 가장 연한 파란색
      '10대': '#90CAF9',     // 연한 파란색
      '20대': '#64B5F6',     // 중간 파란색
      '30대': '#42A5F5',     // 중간 진한 파란색
      '40대': '#2196F3',     // 진한 파란색
      '50대': '#1E88E5',     // 더 진한 파란색
      '60이상': '#1565C0'    // 가장 진한 파란색
    };
    return colors[group] || '#000';
  };

  // stats 객체를 차트 데이터 형식으로 변환
  const chartData = useMemo(() => {
    if (title === '성별 분포') {
      return [
        {
          value: data.gender.male,
          name: '남성',
          color: '#93C5FD'  // 연한 블루 (Tailwind blue-300)
        },
        {
          value: data.gender.female,
          name: '여성',
          color: '#F9A8D4'  // 연한 핑크 (Tailwind pink-300)
        }
      ];
    } else if (title === '연령대 분포') {
      return Object.entries(data.ageGroups).map(([key, value]) => ({
        value: value,
        name: key,
        color: getAgeGroupColor(key)
      }));
    } else if (title === '응시 여부') {
      return [
        {
          value: data.isGaze.gaze,
          name: '응시',
          color: '#6EE7B7'  // 연한 초록 (Tailwind green-300)
        },
        {
          value: data.isGaze.notGaze,
          name: '미응시',
          color: '#FCA5A5'  // 연한 빨강 (Tailwind red-300)
        }
      ];
    }
    return [];
  }, [data, title]);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 18,
          color: 'black',
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [
        {
          name: sub,
          type: 'pie',
          radius: '50%',
          data: chartData.map(item => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: item.color
            }
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [chartData, title, sub]);

  return (
    <div className="py-6 h-fit flex-1 rounded-lg bg-white border">
      <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
    </div>
  );
};


// 응시 시간 분포 막대
const BarChart = ({ title, data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: title,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.class),
        name: '응시 시간 (초)',
      },
      yAxis: {
        type: 'value',
        name: '사람 수',
      },
      series: [
        {
          name: '사람 수',
          type: 'bar',
          data: data.map(item => item.value),
          itemStyle: {
            color: '#5470C6'
          }
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return (
    <div className="rounded-lg border bg-white shadow-md p-4 h-fit">
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

// 프로그래스 바
const CustomProgress = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="flex flex-col my-2">
      {/** 숫자 */}
      <div className="flex flex-row justify-end items-end">
        <p className="font-bold text-lg">₩ {Math.floor(value).toLocaleString()}</p>
        <p className="">/ {Math.floor(max).toLocaleString()}</p>
      </div>
      {/** 그래프 */}
      <div className="w-full bg-neutral-200 rounded-none h-2 relative">
        <div
          className="bg-blue-300 h-full rounded-none"
          style={{ width: `${percentage}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
        </div>
      </div>
    </div>
  );
};


export { TextStatBox, PieChart, BarChart, LineChart, CustomProgress };