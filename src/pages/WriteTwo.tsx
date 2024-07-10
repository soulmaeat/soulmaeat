import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from 'react-router-dom';
import PreferKeyword from '../components/PreferKeyword';
import axios from 'axios';


interface WriteTwoProps { 
   userid: string;
   title: string;
   description: string;
   selectedKeywords: string[];
   selectedPayment: string;
   selectPlace: any;
}

interface MenuProps {
   name: string;
   price: number;
   quantity: number;
   total: number;
}

const WriteTwo: React.FC = () => {
   const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
   const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [isButtonActive, setIsButtonActive] = useState(false);
   const [beforeSelectedPlace, setBeforeSelectedPlace] = useState<any>(null);
   const navigate = useNavigate();
   const location = useLocation();
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
         localStorage.setItem('selectedPlace', JSON.stringify(selectPlace));
      }
   },[selectPlace])

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
         <dl className='mb-8 mx-3'>
            <dt></dt>
            <dd className='text-md'>{selectPlace.place_name}</dd>
            <dd className='text-sm font-thin'>{selectPlace.road_address_name}</dd>
         </dl> 
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
         <div className="flex justify-center space-x-24 mb-10">
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
         {selectedPayment==='미리 결제'&&
         <div className="mb-20 w-full flex-col items-center  max-w-xl">
            <div className='px-4 w-full'>
               <h2 className='text-xl font-bold'>모바일 영수증</h2>
               <p className='border-b border-black pb-4'>정확한 가격을 기재해주세요.</p>
            </div>
            <div className='mb-2 mt-3 px-4'>
               {/* <p className='text-gray-400 text-center'>예) 로제파스타 | 12,000원 | 1개</p> */}
               <div className='flex justify-between font-bold mt-3'>
                  <p>상품명</p>
                  <p>가격</p>
                  <p>수량</p>
                  <p>총액</p>
               </div>
               <ul className='border-b border-black pb-3'>
                  {
                  <>
                     <li className='flex justify-between mt-3'>
                        <p>로제파스타</p>
                        <p><span>12,000</span>원</p>
                        <p>2</p>
                        <p><span>24,000</span>원</p>
                     </li>
                     <li className='flex justify-between mt-3'>
                        <p>크림리조또</p>
                        <p><span>9,000</span>원</p>
                        <p>3</p>
                        <p><span>27,000</span>원</p>
                     </li>
                  </>
                  }
               </ul>
            </div>
            <div className='px-4'>
               <h3 className='font-[600] text-lg text-end'>총 합계</h3>
               <p className='text-end'>51,000원</p>
            </div>
            <div className='w-full flex justify-between items-center mt-4 shrink-0 px-4'>
               <input className='h-10 w-[30%] px-1 rounded-xl bg-gray-100 text-center'
               type="text" placeholder='상품명' />
               <input className='h-10 w-[20%] px-1 rounded-xl bg-gray-100 text-center'
               type="number" placeholder='가격' />
               <input className='h-10 w-[14%] px-1 rounded-xl bg-gray-100 text-center'
               type="number" placeholder='수량' />
               
               <p className='inline-block'><span>총액</span>원</p>
               <button className='block rounded-[40px] whitespace-nowrap bg-customOrange text-white w-[43px] h-[32px]'>추가</button>
            </div>

         </div>
         }
         <div className='mb-[56px] w-full text-center'>
            <button
               className={` left-0 right-0 mx-auto w-[360px] h-[56px] font-bold text-[20px] rounded-[40px] transition-all duration-700 
               ${isButtonActive ? 'bg-[#D75B22] text-white' : 'bg-[#F5F5F5] text-[#BDBDBD]'}`}
               onClick={() => {
                  if (isButtonActive) navigate('/detail');
               }}>
               다음
            </button>
         </div>
      </section>
   )
}


export default WriteTwo;
