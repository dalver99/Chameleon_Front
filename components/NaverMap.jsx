'use client';

import { useEffect, useRef, useContext } from 'react';
import Script from 'next/script';
import MapContext from '@/providers/MapProvider';

const NaverMap = () => {
  const mapRef = useRef(null);
  const naverMapRef = useRef(null);
  const markerRefs = useRef([]);
  const { markers, setCurMark } = useContext(MapContext);

  const initializeMap = () => { // 맵 초기화
    if (mapRef.current && window.naver && !naverMapRef.current) {
      naverMapRef.current = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울 중심 좌표
        zoom: 13,
      });
    }
  };

  useEffect(() => {
    if (window.naver) {
      initializeMap();
    }
  }, [markers]);

  useEffect(() => {
    if (naverMapRef.current && markers.length > 0) {
      // 기존 마커 제거
      markerRefs.current.forEach(({ marker, infoWindow }) => {
        marker.setMap(null);
        infoWindow.close();
      });
      markerRefs.current = [];

      // 첫 번째 마커의 위치로 지도 이동
      const firstMarker = markers[0];
      const firstMarkerPosition = new window.naver.maps.LatLng(firstMarker.lat, firstMarker.lng);
      naverMapRef.current.setCenter(firstMarkerPosition);

      markers.forEach(({ name, lat, lng, state }, index) => {
        const markerColor = state === 'on' ? 'rgb(22, 163, 74)' : '#808080'; // 파란색(on), 회색(off)

        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map: naverMapRef.current,
          icon: {
            content: `
              <div style="width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 24px solid ${markerColor}; animation: bounce 1s infinite;"></div>
            `,
            anchor: new window.naver.maps.Point(12, 12),
          }
        });

        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div style="padding:10px;">
            <strong>${name}</strong>
            <br>상태: ${state === 'on' ? '활성' : '비활성'}
          </div>`,
          zIndex: 10,
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          const isOpen = infoWindow.getMap();

          if (!isOpen) {
            markerRefs.current.forEach(({ infoWindow }) => infoWindow.close());
            infoWindow.open(naverMapRef.current, marker);
            setCurMark(index);
          } else {
            infoWindow.close();
            setCurMark(null);
          }
        });

        markerRefs.current.push({ marker, infoWindow });
      });
    }
  }, [markers]);


  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onLoad={() => {
          // 네이버 맵 API가 로드된 후 initializeMap 호출
          if (window.naver) {
            initializeMap();
          }
        }}
      />
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
};

export default NaverMap;
