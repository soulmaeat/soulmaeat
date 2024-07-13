import {FC, Dispatch, SetStateAction, useState, useEffect, ChangeEvent, FormEvent} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { LatLng, Location } from '../pages/Location';

interface LocationProps{
  closeModal: Dispatch<SetStateAction<boolean>>;
  appear: boolean;
}

export const SearchCurrent:FC<LocationProps> = ({closeModal, appear})=>{
  const kakao = window['kakao'];
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState<boolean>(false); // 선택 버튼 활성화
  const [keyword, setKeyword] = useState<string>('');
  const [place, setPlace] = useState<any>(null);
  const [places, setPlaces] = useState<any[]>([]); // 검색 결과를 담을 배열
  const [msg, setMsg] = useState<string>('');
  const [displayStatus, setDisplayStatus] = useState<string>('none');
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState<number>(-1); // 선택한 장소 인덱스
  const [currentPlace, setCurrentPlace] = useState<any>(null); // 선택한 장소
  const [currentLocation, setCurrentLocation] = useState<LatLng>(()=>{
    const storedLatLng = localStorage.getItem('latLng');
    return storedLatLng ? JSON.parse(storedLatLng) : {lat: 37.56100278, lng: 126.9996417};
  });
  const [locationInfo, setLocationInfo] = useState<Location>(() => {
    const storedLocationInfo = localStorage.getItem('locationInfo');
    return storedLocationInfo ? JSON.parse(storedLocationInfo) : {};
  });

  useEffect(() => {
    let ps = new kakao.maps.services.Places(); // 장소 검색 객체를 생성합니다
    setPlace(ps);
  },[]);

  useEffect(() => {
    if(currentPlace){
      setIsActive(true);
    }else{
      setIsActive(false);
    }
  },[currentPlace]);

  useEffect(() => {
    if(keyword.trim().length > 0){
      setDisplayStatus('block');
    }else{
      setDisplayStatus('none');
    }
  },[keyword]);

  const searchPlaces = (e:FormEvent)=>{
    e.preventDefault();
    if (!keyword.replace(/^\s+|\s+$/g, '') || keyword.trim().length === 0) {
      setMsg('키워드를 입력해주세요.');
      return;
    }else{
      // 검색 선택 초기화
      setMsg('');
    }
    place.keywordSearch(keyword, placesSearchCB, { 
      location: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      sort: kakao.maps.services.SortBy.DISTANCE // 거리순 정렬
    }); 
  }

  const placesSearchCB = (data:any, status:any)=>{
    if (status === kakao.maps.services.Status.OK) {
      // Map 객체를 사용하여 중복된 address_name을 필터링
      const uniquePlacesMap = new Map();
      data.forEach((place:any) => {
        // set: 중복을 허용하지 않음
          uniquePlacesMap.set(place.address_name, place);
      });
      console.log(uniquePlacesMap);
      const uniquePlaces = Array.from(uniquePlacesMap.values()); // form: Map 객체를 배열로 변환, value만 추출
      // 중복이 제거된 배열
      setPlaces(uniquePlaces);

    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
    } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 중 오류가 발생했습니다.');
    }
  }

  const onChangeHandler = (e:ChangeEvent<HTMLInputElement>)=>{
    setKeyword(e.target.value);
  }

  const selectedPlace = (place:any, index:number)=>{
    setCurrentPlace(place);
    setCurrentPlaceIndex(index);
    setLocationInfo(()=>{
      const {address_name, road_address_name} = place;
      return {numberAddr: address_name, roadAddr: road_address_name, adminAddr: ''};
    })
    console.log(locationInfo);
    
  }
  
  return (
    <form className={`${appear? 'opacity-100':'opacity-0 pointer-events-none'} 
    duration-300 transition-opacity`}>
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="fixed inset-0 flex justify-center items-center mx-2">
        <div className="relative max-w-xl w-full bg-white rounded shadow-xl p-4">
          <h1 className='font-bold mb-6'>위치 검색하기</h1>
          <div>
            <div className='flex justify-center'>
              <div className="input_container w-[80%] relative">
                <input className='px-2 py-2 text-xl text-left font-thin w-full border-b-gray-500 border-b'
                type="text" onChange={(e)=>onChangeHandler(e)} value={keyword} 
                placeholder='주소 또는 장소를 검색하세요.'
                onKeyDown={(e)=>{
                  if(e.key === 'Enter'){searchPlaces(e);}}} />
                <button type='reset' className='absolute right-2 top-3 text-gray-300'>
                  <IoCloseCircle className='cursor-pointer' size={20}
                    style={{display: displayStatus}}
                    onClick={()=>{
                      setDisplayStatus('none');
                      setKeyword('');
                    }}
                    type='reset'
                  />
                </button>
                <p className='text-red-500 text-sm top-12 py-1 bg-white w-full'>{msg}</p>
              </div>
              <button onClick={searchPlaces} className='cursor-pointer mx-2'><IoIosSearch size={32} /></button>
            </div>
            <ul className='h-[300px] overflow-y-auto'>
              <li className='h-[12px]'></li>
              {places&&places.map((place:any, index:number)=>(
                <li key={index} onClick={()=>{
                  selectedPlace(place, index);
                }}
                className={`text-start px-2 pt-2 cursor-pointer whitespace-nowrap bg-${index===currentPlaceIndex&& 'gray-200'}`}>
                  <p className=' text-ellipsis overflow-hidden'>{place.address_name}</p>
                  <p className='text-base text-gray-500 font-thin border-b border-gray-300 pb-2 text-ellipsis overflow-hidden'>
                    {place.road_address_name&&
                      place.road_address_name
                    }
                    {!place.road_address_name&&
                      '도로명 주소가 없습니다.'
                    }
                    {/* {' ' + place.place_name} */}
                    </p>
                </li>
              ))
              }
            </ul>
          </div>
          <div className='flex w-full justify-end mt-4'>
            <Link to='/main' className='mr-[4%]'>
              <button onClick={()=>{if(isActive){
                localStorage.setItem('latLng', JSON.stringify({lat: currentPlace.y, lng: currentPlace.x}));
                localStorage.setItem('locationInfo', JSON.stringify(locationInfo));
                closeModal(false);
                location.href = '/main';
              }}}
              style={{ backgroundColor: isActive ? '#63B412' : '#F5F5F5', color: isActive ? '#FFFFFF' : '#BDBDBD'}}
              className='px-6 rounded-2xl h-[40px] w-[140px] text-base font-bold'
              >주소 저장</button>
            </Link>
            <button className='bg-customOrange text-white px-6 rounded-2xl h-[40px] text-base font-bold' 
            onClick={() => closeModal(false)}>닫기</button>
          </div>
        </div>
      </div>
    </form>
    );
  };