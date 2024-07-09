import {ChangeEvent, FC, useEffect, useState, FormEvent} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosSearch } from "react-icons/io";
import { IoLocationOutline, IoCloseCircle } from "react-icons/io5";

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
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState<number>(-1);
  const [isButtonSelected, setIsButtonSelected] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');
  const [displayStatus, setDisplayStatus] = useState<string>('none');
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
      // 현재 위치를 기준으로 장소검색 > FD6(음식점) 카테고리
      placeService.categorySearch('FD6', placesSearchCB, {
        location: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
        radius: 5000 // 5km 반경 내에서 검색
      })
    }
  },[currentLocation, placeService]);
  

  const changeHandler = (e:ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if(e.target.value){
      setDisplayStatus('block');
    }else{
      setDisplayStatus('none');
    }
    setKeyword(e.target.value);
  }

  const searchPlaces = (e:FormEvent) => {
    e.preventDefault();
    if (!keyword.replace(/^\s+|\s+$/g, '')) {
      setMsg('키워드를 입력해주세요.');
      return false;
    }else{
      // 검색 선택, 오류 메세지 초기화
      setSelectedPlaceIndex(-1);
      setIsButtonSelected(false);
      setIsButtonActive(false);
      setMsg('');
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

  // 검색 결과 목록 표출
  const placesList = (data:any) => {
    setPlaces({place:data});
  }
  
  // 선택한 장소 정보 저장, 버튼 활성화
  const selectedPlace = (place:any, index:number) => {
    setSelectPlace(place);
    setSelectedPlaceIndex(index);
    setIsButtonSelected(true);
    setIsButtonActive(true);
  }

  return (
    <form
    className=' p-5 min-h-screen max-w-3xl mx-auto text-center size-full relative'>
      <div className="fixed bg-white top-[1.25rem] w-full max-w-3xl">
        <div className="flex items-center mb-[22px]">
            <IoIosArrowBack onClick={()=>{navigate('/')}} className='cursor-pointer' size={35} />
            <h1 className="mx-2">글 작성하기</h1>
         </div>
        <div className='flex flex-col items-center px-4 pt-4'>
          <h2 className='text-start px-1 text-2xl font-bold w-[90%]'>어디서 먹을까요?</h2>
          <div className="flex justify-between w-[90%] mt-5 items-center relative">
            <input 
            onChange={(e)=>changeHandler(e)}
            onKeyDown={(e)=>{
              if(e.key === 'Enter'){
                searchPlaces(e);
              }
            }}
            className='w-[90%] px-2 py-2 text-xl text-left font-thin border-b-gray-500 border-b' type="text" placeholder='음식점 이름' />
            <IoIosSearch type='button' onClick={searchPlaces} className='ml-2 cursor-pointer' size={35} />
            <button type='reset' className='absolute left-[82%] text-gray-300'>
            <IoCloseCircle className='cursor-pointer' size={20}
              style={{display: displayStatus}}
              onClick={()=>{
                setDisplayStatus('none');
              }}
              type='reset'
            />
            </button>
          </div>
          <p className='text-sm my-2 pl-10 text-red-500 text-start w-full'>{msg}</p>
        </div>
      </div>
        <div className='mt-[208px] size-full flex flex-col items-center'>
          <ul className='h-full w-full'>
            {places&&
              places.place.map((place:any, index:number) => (
              <li key={index} onClick={()=>{
                selectedPlace(place, index);
              }}
              style={{
                backgroundColor: selectedPlaceIndex === index ? '#dedede' : 'transparent'
                }}
              className='flex text-start border-b px-3 py-2 items-center hover:bg-gray-100 cursor-pointer'>
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
        <div className="fixed bottom-10 btn_cont w-full max-w-3xl">
          <button type='submit' onClick={()=>{
            navigate('/writetwo', {state: {selectPlace: selectPlace}});
          }}
          className={
            `fixed bottom-[56px] left-0 right-0 mx-auto w-[360px] h-[56px] font-bold text-[20px] rounded-[40px] transition-all duration-700 
            ${isButtonActive ? 'bg-[#D75B22] text-white' : 'bg-[#F5F5F5] text-[#BDBDBD]'}`
          }
          >다음</button>
        </div>
    </form>
  );
}

export default Write;