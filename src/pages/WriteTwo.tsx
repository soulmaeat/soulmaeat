import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import PreferKeyword from '../components/PreferKeyword';

const WriteTwo: React.FC = () => {
   const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
   const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [isButtonActive, setIsButtonActive] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      if (title && description && selectedPayment) {
         setIsButtonActive(true);
      } else {
         setIsButtonActive(false);
      }
   }, [title, description, selectedPayment]);

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
            <IoIosArrowBack size={35} />
            <h1 className="mx-2">글작성</h1>
         </div>
         <div className="text-[20px] font-bold px-5">글을 작성해주세요</div>
         <div className='mt-[20px] mb-[32px] w-[100%] h-[1px] bg-[#888888]'></div>
         <textarea
            className='w-full h-[50px] mb-[34px] border border-[#D6D6D6] rounded-[12px] p-2 py-3'
            placeholder='제목을 입력해 주세요'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
         ></textarea>
         <textarea
            className='w-full h-[360px] border border-[#D6D6D6] rounded-[12px] p-2 py-3 mb-6'
            placeholder='소개글을 입력해 주세요'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
         ></textarea>
         <div className='mb-7'>
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
         <div className="flex justify-center space-x-16">
            <div
               className={`flex justify-center items-center w-[140px] h-[40px] text-[16px] font-bold border rounded-[16px] cursor-pointer transition-all duration-300
               ${selectedPayment === '미리 결제' ? 'bg-[#D75B22] text-white' : 'text-[#D75B22] border-[#D75B22]'}`}
               onClick={() => handleSelectPayment('미리 결제')}
            >
               미리 결제
            </div>
            <div
               className={`flex justify-center items-center w-[140px] h-[40px] text-[16px] font-bold border rounded-[16px] cursor-pointer transition-all duration-300
               ${selectedPayment === '만나서 결제' ? 'bg-[#D75B22] text-white' : 'text-[#D75B22] border-[#D75B22]'}`}
               onClick={() => handleSelectPayment('만나서 결제')}
            >
               만나서 결제
            </div>
         </div>

         <button
            className={`fixed bottom-[56px] left-0 right-0 mx-auto w-[360px] h-[56px] font-bold text-[20px] rounded-[40px] transition-all duration-700 
            ${isButtonActive ? 'bg-[#D75B22] text-white' : 'bg-[#F5F5F5] text-[#BDBDBD]'}`}
            onClick={() => {
               if (isButtonActive) navigate('/main');
            }}>
            다음
         </button>
      </section>
   )
}

export default WriteTwo;
