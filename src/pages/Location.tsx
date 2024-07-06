import {FC, useState, useRef, useEffect} from 'react'
// tsx => import.meta.env.KAKAO_JS_KEY
// html header => <%=env.KAKAO_JS_KEY=%>
// js => process.env.KAKAO_JS_KEY
// vite => %VITE_KAKAO_JS_KEY% // vite는 환경변수를 동적으로 전환할수 있음 // 개발환경이 아닌 로컬 환경에서는 서버를 껐다 켜줘야 한다.
// https://map.kakao.com/link/search/카카오

export interface Location{
  numberAddr?: string;
  roadAddr?: string;
  adminAddr?: string;
}
export interface LatLng{
  lat: number;
  lng: number;
}

export const Location:FC = () => {
  const kakao = window.kakao; // kakao 지도 api를 전역으로 사용하기 위해 window 객체에 할당
  const [locationInfo, setLocationInfo] = useState<Location>({});
  const [marker, setMarker] = useState<any | null>(new kakao.maps.Marker()); // 마커 객체
  const [kakaoMap, setKakaoMap] = useState<any | null>(null);
  const [geocoder, setGeocoder] = useState<any | null>(null); 
  const [latLng, setLatLng] = useState<LatLng>({lat: 37.56100278, lng: 126.9996417});

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getKakaoMap = async()=>{
      await createKakaoMap();
      // await getCurrentLocation();
      // await setCenter();
    }
    getKakaoMap();
  }, []);
  // 카카오 맵이 생성되면 마커 생성
  useEffect(() => {
    if (kakaoMap) {
      makeMarker();
    }
  }, [kakaoMap]);
  // 마커가 생성되면 지도에 표시
  useEffect(() => {
    if (marker && kakaoMap) {
      marker.setMap(kakaoMap);
    }
  }, [marker, kakaoMap]);


  // 카카오 지도 생성
  const createKakaoMap = async() => {
    if (containerRef.current && kakao && kakao.maps) {
      let options = {
        center: new kakao.maps.LatLng(37.56100278, 126.9996417), // 기본 위치: 서울 중구
        level: 3, // 지도 확대 레벨
        draggable: false, // 지도 이동 불가
      };
      setKakaoMap(new kakao.maps.Map(containerRef.current, options))
    }
  };


  // 지도 마커 표시
  const makeMarker = async()=>{
    const imageSrc = '/img/marker2.svg';// 마커이미지 주소 
    const imageSize = new kakao.maps.Size(60, 60); // 마커 크기
    const imageOption = {offset: new kakao.maps.Point(30, 30)}; // 마커 옵션
    // 마커 이미지 정보를 담아 생성
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
    const markerPosition = new kakao.maps.LatLng(37.56100278, 126.9996417); // 표시될 위치

    // 마커 생성
    const newMarker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
    });

    // 마커가 지도 위에 표시되도록 설정
    setMarker(newMarker);
    // marker.setMap(kakaoMap); 
  }

  // 현재 위치를 가져오는 함수
  const getCurrentLocation = async() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatLng({lat, lng});
        updateMarkerPosition({ lat, lng });
      });
  }};

   // 마커 위치 업데이트 함수
   const updateMarkerPosition = (latLng: LatLng) => {
    if (marker) {
      const newPosition = new kakao.maps.LatLng(latLng.lat, latLng.lng);
      marker.setPosition(newPosition);
      marker.setMap(kakaoMap);
    }
  };

  // 카카오 현재 위치 적용
  const setCenter = async() => {
    // 주소-좌표 변환 객체 생성
    // 위치 객체 초기화
    const newGeocoder = new kakao.maps.services.Geocoder();
    setGeocoder(newGeocoder);

    //좌표로 (법정동) 상세 주소 정보 요청
    const searchDetailAddrFromCoords = (
      coords: kakao.maps.LatLng,
      callback: (result: kakao.maps.services.Address[], status: kakao.maps.services.Status) => void
    ) => {
      geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    };

    // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시
    const searchAddrFromCoords = (
      coords: kakao.maps.LatLng,
      callback: (result: kakao.maps.services.RegionCodeResult[], status: kakao.maps.services.Status) => void
    ) => {
      // 좌표로 행정동 주소 정보를 요청
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    };

    // 행정동 주소
    const displayCenterInfo = (
      result: kakao.maps.services.RegionCodeResult[],
      status: kakao.maps.services.Status
    ) => {
      if (status === kakao.maps.services.Status.OK) {
        setLocationInfo({ ...locationInfo, adminAddr: result[0].address.address_name });
      }
    };

    // 지도의 중심좌표 얻어오기
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);

    // 현재위치의 도로명, 지번 주소
    searchDetailAddrFromCoords(latLng, function(result:any, status:any){
      if (status === kakao.maps.services.Status.OK) {
        setLocationInfo({... locationInfo, numberAddr: result[0].address.address_name, roadAddr: result[0].road_address.address_name});
      }
    });
};

  return (
    <div className='max-w-3xl mx-auto text-center text-xl size-full relative' >
      <h1 className='py-3 font-bold'>지도에서 내 위치 확인</h1>
      <div ref={containerRef} style={{ width: '100%', height: '80%' }}></div>
      <div className='absolute size-full z-10 flex-col flex justify-center items-center px-8' style={{borderRadius: '24px 24px 0 0', backgroundColor: '#fff', height: '200px', bottom:'0', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'}}>
        <div className='text-start text-base' style={{width: '100%'}}>
          <p className='font-bold'>지명주소</p>
          <p className='mt-2'>도로명주소</p>
        </div>
        <button className='rounded-full size-4/5 max-h-12 bg-[#D75B22] text-white font-bold text-base mt-8'>
          이 위치로 주소 등록
        </button>
      </div>
    </div>
  );
};