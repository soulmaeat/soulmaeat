import {ChangeEvent, FC, useEffect, useState, FormEvent} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosSearch } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";

export interface latLngProps {
  latLngInfo: {
    lat: number;
    lng: number;
  };
}

interface Place<T> {
  place: T[];
}

const Write:FC<latLngProps> = ({latLngInfo})=>{
  const kakao = window['kakao'];
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place<any>>({place:[]});
  const [keyword, setKeyword] = useState<string>('');
  const [placeService, setPlaceService] = useState<any>(null);
  const [selectPlace, setSelectPlace] = useState<any>(null);
  const [selectedBg, setSelectedBg] = useState<string>('white');
  const [currentLocation, setCurrentLocation] 
        = useState<latLngProps['latLngInfo']>(latLngInfo);
  
  useEffect(() => {
    if(!currentLocation) alert('위치 정보가 없어 주변 검색이 불가능합니다.');
    // 장소 검색 객체 생성
    const place = new kakao.maps.services.Places();
    // 장소 검색 객체를 전역으로 사용하기 위해 state에 저장
    setPlaceService(place);
  },[]);
  useEffect(() => {
    if(currentLocation && placeService){
      // 현재 위치를 기준으로 장소검색
      placeService.categorySearch('FD6', placesSearchCB, {
        location: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
        radius: 5000
      })
    }
  },[currentLocation, placeService]);
  

  const changeHandler = (e:ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setKeyword(e.target.value); 
  }

  const searchPlaces = (e:FormEvent) => {
    e.preventDefault();
    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }
    // 장소검색 객체를 통해 키워드로 장소검색을 요청
    placeService.keywordSearch( keyword, placesSearchCB);
  };

  function placesSearchCB(data:any, status:any) {
    if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료 시, 검색 목록 표출
        placesList(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;
    } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
    }
  }

  const placesList = (data:any) => {
    setPlaces({place:data});
  }

  const selectedPlace = (place:any) => {
    setSelectPlace(place);
    alert(place.place_name+place.road_address_name);
  }

  return (
    <form onSubmit={searchPlaces}
    className='max-w-3xl mx-auto text-center size-full relative'>
      <div className="fixed bg-white top-0 w-full">
        <div className="location_nav p-3 flex w-100 justify-start align-middle">
        <Link to='/main' className='inline-block'><IoIosArrowBack size={35} /></Link>
        <h1 className='flex items-center' >글 작성하기</h1>
        </div>
        <div className='flex flex-col items-center p-4'>
          <h2 className='text-start px-1 text-2xl font-bold w-[90%]'>어디서 먹을까요?</h2>
          <div className="flex w-[90%] mt-5 items-center">
            <input onChange={(e)=>changeHandler(e)}
            className='w-[90%] px-2 py-2 text-xl text-left font-thin border-b-gray-500 border-b' type="text" placeholder='음식점 이름' />
            <IoIosSearch type='text' onClick={searchPlaces} className='ml-2 cursor-pointer' size={35} />
          </div>
        </div>
      </div>
        <div className='mt-[190px] size-full flex flex-col items-center'>
          <ul className='h-full w-full'>
            {places&&
              places.place.map((place:any, index:number) => (
              <li key={index} onClick={()=>{
                selectedPlace(place);
              }}
              className='flex text-start border-b px-3 py-2 items-center hover:bg-gray-100 cursor-pointer active:bg-gray-200'>
                <IoLocationOutline className='mx-4' size={35} />
                <dl className='w-[80%]'>
                  <dt className='text-xl'>{place.place_name}</dt>
                  <dd className='text-sm font-thin whitespace-nowrap 
                  text-ellipsis overflow-hidden'>
                    {place.road_address_name}
                  </dd>
                  <dd className='text-sm font-thin whitespace-nowrap 
                  text-ellipsis overflow-hidden'>
                    {place.phone}
                  </dd>
                </dl>
              </li>
              ))
            }
          </ul>
        </div>
        <div className="fixed bottom-10 btn_cont w-full">
          <button type='submit' onClick={()=>{
            navigate('/write2', {state: {selectPlace: selectPlace}});
          }}
          className='w-[90%] px-3 py-2 rounded-full text-white bg-customOrange text-xl font-bold active:bg-[#97441d]'>다음</button>
        </div>
    </form>
  );
}

export default Write;