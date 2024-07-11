import React, { useState, useEffect, FC } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from 'react-router-dom';
import PreferKeyword from '../components/PreferKeyword';
import { Bills } from '../components/Bills';
import { UserData } from '../App';
import axios from 'axios';


interface DetailData {
  postId: number;
  author: any | null;
  title: string;
  description: string;
  selectedKeywords: string[];
  selectedPayment: string | null;
  joinedPeople: number;
  placeName: string | undefined;
  placeCategory: string | undefined;
  placePhone: string | undefined;
  placeUrl: string | undefined;
  placeAddr: string | undefined;
  placeRoadAddr: string | undefined;
  x: number;
  y: number;
}

interface BillsProps {
   name: string;
   price: number;
   quantity: number;
   total: number;
}

interface WriteProps { // props로 받아올 user 정보
   userData: UserData | null;
}

const WriteTwo:FC<WriteProps> = ({userData}) => {
   const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
   const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [isButtonActive, setIsButtonActive] = useState(false);
   const [beforeSelectedPlace, setBeforeSelectedPlace] = useState<any>(null);
   const [joinedPeople, setJoinedPeople] = useState<number>(1);
   const navigate = useNavigate();
   const location = useLocation();
   const [postId, setPostId] = useState<number>(0);
   const { selectPlace } = location.state || {};
   // 모바일 영수증이 식당 값이 바뀌지 않는 이상, localstorage에 저장해두고,
   // 실수로 새로고침을 해도 값이 유지되도록 하기
   const [menuList, setMenuList] = useState<any[]>([]);
   
   useEffect(() => {
      if (title && description && selectedPayment) {
         setIsButtonActive(true);
      } else {
         setIsButtonActive(false);
      }
   }, [title, description, selectedPayment]);

   useEffect(()=>{
      if(selectPlace!==beforeSelectedPlace){
         if(beforeSelectedPlace){
            if(selectPlace.id===beforeSelectedPlace.id)return;
         }
         setMenuList([]);
         setBeforeSelectedPlace(selectPlace);
         localStorage.setItem('selectedPlace', JSON.stringify(selectPlace));
      }
   },[selectPlace])

   const sendDetailInfo = async () => {
    const data: DetailData = {
        author: userData?.user.author,
        postId,
        title,
        description,
        selectedKeywords,
        selectedPayment,
        placeName: selectPlace.road_address_name,
        placeCategory: selectPlace.category_name,
        placePhone: selectPlace.phone,
        placeUrl: selectPlace.place_url,
        placeAddr: selectPlace.address_name,
        placeRoadAddr: selectPlace.road_address_name,
        x: selectPlace.y,
        y: selectPlace.x,
        joinedPeople,
    };
    console.log(data);
    try {
      setPostId(postId+1);
      const url = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${url}/api/post`, data);
      console.log(response);
      navigate('/detail');
    } catch (error) {
        console.error(error);
    }
   }

   const handleSelectKeyword = (title: string, isActive: boolean) => {
      setSelectedKeywords((prev) => {
         if (isActive) {
            return [...prev, title];
         } else {
            return prev.filter((item) => item !== title);
         }
      });
   };

   const handleSelectPayment = (paymentType: string) => {
      setSelectedPayment(paymentType);
   };

   return (
      <section className="max-w-3xl mx-auto p-5 min-h-screen">
         <div className="flex items-center mb-[22px]">
            <IoIosArrowBack onClick={()=>{navigate('/write')}} className='cursor-pointer' size={35} />
            <h1 className="mx-2">글 작성하기</h1>
         </div>
         <div className="text-[20px] font-bold px-5">글을 작성해주세요</div>
         <div className='mt-[20px] mb-[32px] w-[100%] h-[1px] bg-[#888888]'></div>
         {selectPlace&&
         <div className='flex justify-between mb-8 mx-3'>
          <dl className='flex flex-col justify-center'>
              <dt></dt>
              <dt className='text-md'>{selectPlace.place_name}</dt>
              <dd className='text-sm font-thin'>{selectPlace.road_address_name}</dd>
          </dl>
          <div className='mr-4 flex flex-col items-center'>
            <span className='font-bold mb-2'>모집 인원</span>
            <div className='flex'>
              <button onClick={()=>{
                if(joinedPeople>1)setJoinedPeople(joinedPeople-1);
              }}
              className='mr-2 p-1 bg-customOrange text-white w-[28px] h-[28px] 
              flex items-center justify-center rounded-sm'>-</button>
              <span>{joinedPeople}명</span> 
              <button onClick={()=>{
                if(joinedPeople<5){setJoinedPeople(joinedPeople+1)}else{
                  alert('최대 5명까지만 가능합니다.');
                }
              }}
              className='ml-2 p-1 bg-customOrange text-white w-[28px] h-[28px] 
              flex items-center justify-center rounded-sm'>+</button>
            </div>
          </div>
         </div>
         }
         <textarea
            className='w-full h-[50px] mb-[34px] border border-[#D6D6D6] rounded-[12px] p-2 py-3'
            placeholder='제목을 입력해 주세요'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
         ></textarea>
         <textarea
            className='w-full h-[300px] border border-[#D6D6D6] rounded-[12px] p-2 py-3 mb-10'
            placeholder='소개글을 입력해 주세요'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
         ></textarea>
         <div className='mb-10'>
            <div>선호키워드</div>
            <div className="overflow-x-auto">
               <div className='flex whitespace-nowrap'>
                  <PreferKeyword title='동성 친구만' onSelect={handleSelectKeyword} />
                  <PreferKeyword title='음주 X' onSelect={handleSelectKeyword} />
                  <PreferKeyword title='여러 개 주문해서 나눠먹기' onSelect={handleSelectKeyword} />
                  <PreferKeyword title='조용한 식사' onSelect={handleSelectKeyword} />
                  <PreferKeyword title='반려동물 동반 가능' onSelect={handleSelectKeyword} />
               </div>
            </div>
         </div>
         <div className="flex justify-center space-x-24">
            <div
               className={`flex justify-center items-center w-[140px] h-[40px] text-[16px] font-bold border rounded-[16px] cursor-pointer transition-all duration-300
               ${selectedPayment === '미리 결제' ? 'bg-[#D75B22] text-white' : 'text-[#D75B22] border-[#D75B22]'}`}
               onClick={() => handleSelectPayment('미리 결제')}>
               미리 결제
            </div>
            <div
               className={`flex justify-center items-center w-[140px] h-[40px] text-[16px] font-bold border rounded-[16px] cursor-pointer transition-all duration-300
               ${selectedPayment === '만나서 결제' ? 'bg-[#D75B22] text-white' : 'text-[#D75B22] border-[#D75B22]'}`}
               onClick={() => handleSelectPayment('만나서 결제')}>
               만나서 결제
            </div>
         </div>
         <div className='flex justify-center space-x-24 mt-2 mb-10 text-sm text-center text-gray-500'>
            <p className='w-[140px]'>* 뷔페와 같이 동일 가격의 식당에서 추천해요.</p>
            <p className=''>* 만나서 결제를 추천해요.</p>
         </div>
         {selectedPayment==='미리 결제'&&
         <div className='flex justify-center'>
           <Bills />
         </div>
         }
         <div className='mb-[56px] w-full text-center'>
            <button
               className={` left-0 right-0 mx-auto w-[360px] h-[56px] font-bold text-[20px] rounded-[40px] transition-all duration-700 
               ${isButtonActive ? 'bg-[#D75B22] text-white' : 'bg-[#F5F5F5] text-[#BDBDBD]'}`}
               onClick={() => {
                  if (isButtonActive) sendDetailInfo();
               }}>
               다음
            </button>
         </div>
      </section>
   )
}


export default WriteTwo;
