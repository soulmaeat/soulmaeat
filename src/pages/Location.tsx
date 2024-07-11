import {FC, useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";
import { Badge } from '../components/Badge';

interface Location{
  numberAddr?: string;
  roadAddr?: string;
  adminAddr?: string;
}
interface LatLng{
  lat: number;
  lng: number;
}

export const Location:FC = () => {
  const kakao = window['kakao'];
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [marker, setMarker] = useState<any | null>(null);
  const [kakaoMap, setKakaoMap] = useState<any | null>(null);
  const [geocoder, setGeocoder] = useState<any | null>(null); 
  const [locationInfo, setLocationInfo] = useState<Location>(() => {
    const storedLocationInfo = localStorage.getItem('locationInfo');
    return storedLocationInfo ? JSON.parse(storedLocationInfo) : {};
  });
  const [latLng, setLatLng] = useState<LatLng>(()=>{
    const storedLatLng = localStorage.getItem('latLng');
    return storedLatLng ? JSON.parse(storedLatLng) : {lat: 37.56100278, lng: 126.9996417};
  });
  const badgeNum = '지번',
        badgeRoad = '도로명',
        badgeAdmin = '행정동';
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const getKakaoMap = async()=>{
      await createKakaoMap();
      await getCurrentLocation();
    }
    getKakaoMap();
  }, []);
  // 카카오 맵이 생성되면 마커 생성
  useEffect(() => {
    if (kakaoMap) {
      makeMarker(kakaoMap);
    }
  }, [kakaoMap]);
  // 마커가 생성되면 지도에 표시
  useEffect(() => {
    if (marker && kakaoMap) {
      marker.setMap(kakaoMap);
    }
  }, [marker]);
  // 로컬스토리지에 위치정보 저장
  useEffect(() => {
    localStorage.setItem('locationInfo', JSON.stringify(locationInfo));
  }, [locationInfo]);
  // 로컬스토리지에 좌표정보 저장 => 마커,주소정보 갱신
  useEffect(() => {
    if (kakaoMap && geocoder && marker) {
      getAddr();
      updateMap(latLng);
      updateMarkerPosition(latLng);
    }
    localStorage.setItem('latLng', JSON.stringify(latLng));
  }, [latLng, kakaoMap, geocoder]);


  // 카카오 지도 생성
  const createKakaoMap = async() => {
    if (containerRef.current && kakao && kakao.maps) {
      let options = {
        center: new kakao.maps.LatLng(latLng.lat, latLng.lng), // 기본 위치: 서울 중구
        level: 3, // 지도 확대 레벨
        draggable: false, // 지도 이동 불가
      };
      setKakaoMap(new kakao.maps.Map(containerRef.current, options))
      
      // 주소-좌표 변환 객체 생성
      // 위치 객체 초기화
      setGeocoder(new kakao.maps.services.Geocoder());
    }
  };

  // 지도 업데이트 함수
  const updateMap = (latLng: LatLng) => {
    if (kakaoMap) {
      kakaoMap.setCenter(new kakao.maps.LatLng(latLng.lat, latLng.lng));
    }
  };

  // 마커 위치 업데이트 함수
  const updateMarkerPosition = (latLng: LatLng) => {
    if (marker) {
      const newPosition = new kakao.maps.LatLng(latLng.lat, latLng.lng);
      marker.setPosition(newPosition);
    }
  };

  // 지도 마커 표시
  const makeMarker = async(map:any)=>{
    if(map){
      setIsLoading(true);
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
      if(isLoading) setIsLoading(false);
    }else{
      console.error('No map found');
    }
  }

  // 현재 위치를 가져오는 함수
  const getCurrentLocation = async() => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatLng({lat, lng});
        setLocationInfo({ ...locationInfo, numberAddr: '', roadAddr: '', adminAddr: '' });
        // alert(`현재 위치: ${lat}, ${lng}`);
        if(kakaoMap){
          kakaoMap.setCenter(new kakao.maps.LatLng(lat, lng));
          setIsLoading(false);
        }
      });
    }else{
      setTimeout(() => {
        if(isLoading&&!locationInfo&&!latLng){ 
          setIsLoading(false);
          alert('위치 정보를 가져오지 못했습니다. 다시 시도해주세요.');
        }
      }, 10000);
  }
};

  // 카카오 현재 위치 적용
  const getAddr = async() => {
    if (!geocoder || !kakaoMap) return;
    
    //좌표로 (법정동) 상세 주소 정보 요청
    const searchDetailAddrFromCoords = (
      coords: kakao.maps.LatLng,
      callback: (result: kakao.maps.services.Address[], status: kakao.maps.services.Status) => void
    ) => {
      geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    };

    // 현재위치의 도로명, 지번 주소
    searchDetailAddrFromCoords(new kakao.maps.LatLng(latLng.lat, latLng.lng), (result:any, status:any)=>{
      if (status === kakao.maps.services.Status.OK && result.length > 0) {
        const numberAddr = result[0].address?.address_name ?? '';
        const roadAddr = result[0].road_address?.address_name ?? '';
        setLocationInfo((prevInfo) => ({
          ...prevInfo,
          numberAddr: numberAddr,
          roadAddr: roadAddr,
        }));
    }});
};
  const reloadHandler = () => {
    getCurrentLocation();
  };

  const sendLocation = () => {
    // navigate('/main');
    location.href = '/';
  }
  return (
    <div className='max-w-3xl h-full mx-auto text-center text-xl size-full overflow-hidden' >
      <div className="location_nav p-3 flex w-100 justify-between align-middle">
      <Link to='/' className='inline-block'><IoIosArrowBack size={35} /></Link>
      <h1 className='font-bold flex items-center'>지도에서 내 위치 확인</h1>
      <IoReload className='cursor-pointer' size={32} onClick={reloadHandler} />
      </div>
      <div className='w-full h-full relative' style={{overflow: 'hidden'}}>
        {isLoading && 
          <div className='z-10 size-full absolute flex justify-center bg-[#00000033]'>
            <svg className="animate-spin h-5 w-5 mt-[20vw]" viewBox="0 0 40 40" style={{width: '40px', height: '40px'}}>
              <AiOutlineLoading className='text-customOrange' size={40}/>
            </svg>
          </div>
        }
        <div ref={containerRef} style={{ width: '100%', height: '70%' }}></div>
      </div>
      <div className='absolute max-w-3xl size-full z-10 flex-col flex justify-center items-center px-8' style={{borderRadius: '24px 24px 0 0', backgroundColor: '#fff', height: '200px', bottom:'0', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'}}>
        <div className='text-start text-base' style={{width: '100%'}}>
          {locationInfo.numberAddr&&
           // 지명이 있으면 지명으로, 없으면 도로명으로(굵게) 출력
           <div className='flex'>
            <Badge props={badgeNum} />
            <p className='font-bold ml-2'>{locationInfo.numberAddr}</p>
           </div>
          }
          {(!locationInfo.numberAddr&&locationInfo.roadAddr)&&
           <div className='flex'>
             <Badge props={badgeRoad} />
             <p className='font-bold ml-2'>{locationInfo.roadAddr}</p>
           </div>
          }
          {(locationInfo.roadAddr&&locationInfo.adminAddr)||(!locationInfo.adminAddr&&locationInfo.roadAddr)&&
            // 도로명이 있으면 도로명으로, 없으면 행정동으로 출력 (부가 주소)
           <div className='flex'>
             <Badge props={badgeRoad} />
             <p className='mt-2 ml-2'>{locationInfo.roadAddr}</p>
           </div>
          }
          {!locationInfo.roadAddr&&locationInfo.adminAddr&&
           <div className='flex'>
             <Badge props={badgeAdmin} />
             <p className='mt-2 ml-2'>{locationInfo.adminAddr}</p>
           </div>
          }
          {!locationInfo.roadAddr&&!locationInfo.adminAddr&&locationInfo.numberAddr&&
            <p className='mt-2'>도로명이 검색되지 않습니다.</p>
          }
          {locationInfo.roadAddr&&!locationInfo.adminAddr&&!locationInfo.numberAddr&&
            <p className='mt-2'>지번이 검색되지 않습니다.</p>
          }
          {!locationInfo.roadAddr&&!locationInfo.adminAddr&&!locationInfo.numberAddr&&
          <>
            <p className='font-bold'>주소가 검색되지 않습니다.</p>
            <p className='mt-2'>인터넷 연결 또는 위치 허용을 확인해주세요.</p>
          </>
          }
        </div>
        <button 
        className='rounded-full size-4/5 max-h-12 bg-customOrange text-white font-bold text-base mt-8'
        onClick={sendLocation}
        >
          이 위치로 주소 등록
        </button>
      </div>
    </div>
  );
};