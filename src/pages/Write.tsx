import {ChangeEvent, FC, useEffect, useState, FormEvent} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const [places, setPlaces] = useState<Place<any>>({ place: [] });
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
  const location = useLocation();

  useEffect(() => {
    topScroll();
  }, [location]);

  const topScroll = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  
  useEffect(() => {
    if(!currentLocation) alert('위치 정보가 없어 주변 검색이 불가능합니다.');
    // 장소 검색 객체 생성
    const place = new kakao.maps.services.Places();
    // 장소 검색 객체를 전역으로 사용하기 위해 state에 저장
    setPlaceService(place);
  },[]);
  useEffect(() => {
    if(currentLocation && placeService){
      // 사용자가 페이지에 처음 들어왔을 때 기본적으로 근처의 음식점을 보여주기 위해 사용
      searchFoodPlaces();
    }
  },[currentLocation, placeService]);

  const searchFoodPlaces = () => {
    // 음식점 카테고리 코드: FD6
    placeService.categorySearch('FD6', placesSearchCB, {
      location: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      radius: 1000,
      sort: kakao.maps.services.SortBy.DISTANCE
    });
  };
  
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
    if (!keyword.replace(/^\s+|\s+$/g, '') || keyword.trim().length === 0) {
      setMsg('키워드를 입력해주세요.');
      return;
    }else{
      // 검색 선택, 오류 메세지 초기화
      setSelectedPlaceIndex(-1);
      setIsButtonSelected(false);
      setIsButtonActive(false);
      topScroll();
      setMsg('');
    }
    // 장소검색 객체를 통해 키워드로 장소검색을 요청 => 사용자가 검색어를 입력하고 검색 버튼을 눌렀을 때 호출
    placeService.keywordSearch( keyword, keywordSearchCB, { 
      location: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      radius: 5000,
      category_group_code: 'FD6', // 음식점 카테고리 제한
      sort: kakao.maps.services.SortBy.DISTANCE // 거리순 정렬
    });
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
  function keywordSearchCB(data: any, status: any) {
    if (status === kakao.maps.services.Status.OK) {
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
    console.log(place);
    
    setSelectedPlaceIndex(index);
    setIsButtonSelected(true);
    setIsButtonActive(true);
  }

  return (
    <form
    className='min-h-screen max-w-3xl mx-auto text-center size-full relative'>
      <div className="fixed bg-white pt-[1.25rem] top-0 w-full max-w-3xl">
        <div className="flex items-center mb-[22px]">
            <IoIosArrowBack onClick={()=>{navigate('/')}} className='cursor-pointer' size={35} />
            <h1 className="mx-2">글 작성하기</h1>
         </div>
        <div className='flex flex-col items-center'>
          <h2 className='text-start px-1 text-2xl font-bold w-[90%]'>어디서 먹을까요?</h2>
          <div className="flex justify-around w-[96%] mt-5 items-center mx-2">
            <div className="input_container w-[90%] relative border-b-gray-500 border-b">
              <input 
              onChange={(e)=>changeHandler(e)}
              onKeyDown={(e)=>{
                if(e.key === 'Enter'){
                  searchPlaces(e);
                }
              }}
              className='px-2 py-2 text-xl text-left font-thin w-full' type="text" placeholder='음식점 이름' />
              <button type='reset' className='absolute right-2 top-3 text-gray-300'>
                <IoCloseCircle className='cursor-pointer' size={20}
                  style={{display: displayStatus}}
                  onClick={()=>{
                    setDisplayStatus('none');
                  }}
                  type='reset'
                />
              </button>
            </div>
            <button type='submit' onClick={searchPlaces}>
              <IoIosSearch className='cursor-pointer' size={35} />
            </button>
          </div>
          <p className='text-sm my-2 pl-6 text-red-500 text-start w-full'>{msg}</p>
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
              className='flex text-start border-b py-2 items-center hover:bg-gray-100 cursor-pointer h-[88px]'>
                <IoLocationOutline className='mx-2 w-[36px] h-[36px]' />
                <dl className='max-w-[80%]'>
                  <dt className='text-[20px] flex items-center w-full'>
                    <span className='min-w-[20%] whitespace-nowrap text-ellipsis overflow-hidden'>
                      {place.place_name}
                    </span>{place.category_name&&
                    <span className='ml-1 whitespace-nowrap bg-gray-50 text-gray-500 inline-block px-1 text-sm rounded-3xl border-gray-300 border'>{place.category_name.split(' > ').slice(-1)[0]}</span>
                    }
                  </dt>
                  <dd className='text-md w-full whitespace-nowrap flex items-center justify-start'>
                    <span className='min-w-[20%] text-ellipsis overflow-hidden'>
                      {place.road_address_name&&
                        place.road_address_name
                      }
                      {!place.road_address_name&&
                        place.address_name
                      }
                      {!place.road_address_name&&!place.address_name&&
                        '주소 없음'
                      }
                    </span>
                    <span className='text-gray-500 font-thin text-xs ml-2'>{place.distance}m</span>
                  </dd>
                  <dd className='text-sm font-thin whitespace-nowrap 
                  text-ellipsis overflow-hidden'>
                    {place.phone&&
                      place.phone
                    }
                    {!place.phone&&
                      '전화번호 없음'
                    }
                  </dd>
                </dl>
              </li>
              ))
            }
          </ul>
        </div>
        <div className="fixed bottom-10 btn_cont w-full max-w-3xl">
          <button onClick={()=>{
            navigate('/writetwo', {state: {selectPlace: selectPlace}});
          }}
          className={
            `fixed bottom-[56px] left-0 right-0 mx-auto w-[70%] h-[56px] font-bold text-[20px] rounded-[40px] transition-all duration-700 
            ${isButtonActive ? 'bg-[#D75B22] text-white' : 'bg-[#F5F5F5] text-[#BDBDBD]'}`
          }
          >다음</button>
        </div>
    </form>
  );
}

export default Write;