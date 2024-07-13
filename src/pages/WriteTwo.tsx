import { useState, useEffect, FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PreferKeyword from '../components/PreferKeyword';
import { Bills, BillsData } from '../components/Bills';
import { UserData } from '../App';
import axios from 'axios';
import { NavBar } from '../components/NavBar';

interface Preference{
  likeList: string[];
}

interface DetailData {
  author: any | null;
  age: any | null;
  gender: any | null;
  title: string;
  description: string;
  selectPlace: string;
  selectedKeyword: Preference[];
  selectedPayment: string | null;
  placeName: string;
  categoryName: string;
  phone: any | null;
  placeUrl: string;
  addressName: string;
  roadAddressName: string;
  x: number;
  y: number;
  joinedPeople: number;
  bills: BillsData;
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
   const [joinedPeople, setJoinedPeople] = useState<number>(2);
   const [keywordLen, setKeywordLen] = useState<number>(0);
   const navigate = useNavigate();
   const location = useLocation();
   const { selectPlace } = location.state || {};

   // Bills.tsx에서 사용하는 state
   const [allBills, setAllBills] = useState<BillsData>();
   const handleUpdateBills = (bills: BillsData) => {
      setAllBills(bills);
   };

   useEffect(() => {
      topScroll();
    }, [location]);
  
    const topScroll = () => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
   
   // 모바일 영수증이 식당 값이 바뀌지 않는 이상, localstorage에 저장해두고,
   // 실수로 새로고침을 해도 값이 유지되도록 하기
   const [menuList, setMenuList] = useState<any[]>([]);

   useEffect(()=>{ 
      if(selectPlace!==beforeSelectedPlace){
         if(beforeSelectedPlace){
            if(selectPlace.id===beforeSelectedPlace.id)return;
         }
         setMenuList([]); // 새로운 식당을 선택할 때마다 초기화
         setBeforeSelectedPlace(selectPlace);
         localStorage.setItem('selectedPlace', JSON.stringify(selectPlace));
      }
   },[selectPlace])
   
   useEffect(() => { // 글 작성하기 버튼 활성화
      if (title && description && selectedPayment) {
         setIsButtonActive(true);
      } else {
         setIsButtonActive(false);
      }
   }, [title, description, selectedPayment]);

   const sendDetailInfo = async () => {
    const user = userData?.user || null;
    const data: DetailData = {
        author: user?.userId,
        age: user?.age,
        gender: user?.gender,
        title,
        description,
        selectedKeyword: [{ likeList: selectedKeywords }],
        selectedPayment,
        selectPlace: selectPlace.place_name,
        placeName: selectPlace.address_name,
        categoryName: selectPlace.category_name,
        phone: selectPlace.phone,
        placeUrl: selectPlace.place_url,
        addressName: selectPlace.address_name,
        roadAddressName: selectPlace.road_address_name,
        x: selectPlace.y,
        y: selectPlace.x,
        joinedPeople,
        bills: allBills || { billsList: [], allTotal: '0', balance: '0' },
    };
    // console.log(data);
    try {
      alert('글 작성이 완료되었습니다.');
      const url = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${url}/api/post`, data);
      console.log(response);
      navigate('/main');
    } catch (error) {
        console.error(error);
    }
   }

   const handleSelectKeyword = (title: string, isActive: boolean) => {
     if(keywordLen>2&&isActive){ // 3개 이상 선택 시 alert(PreferKeyword Comp)
      return;
     }else{
       setSelectedKeywords((prev) => {
         if(isActive){ // 선택 시
           setKeywordLen(selectedKeywords.length+1)
           return [...prev, title];
          }else{ // 선택 해제 시
            setKeywordLen(selectedKeywords.length-1)
           return prev.filter((item) => item !== title);
         }
       });
     }
   };

   const handleSelectPayment = (paymentType: string) => {
      setSelectedPayment(paymentType);
   };

   return (
      <section className="max-w-3xl mx-automin-h-screen">
         <NavBar title="글 작성하기" />
         <div className='p-4'>
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
               <span className='font-bold'>모집 인원</span>
               <span className='mb-2 text-xs text-gray-600 font-thin'>*본인 포함</span>
               <div className='flex'>
               <button onClick={()=>{
                  if(joinedPeople>2)setJoinedPeople(joinedPeople-1);
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
                     <PreferKeyword keywordLen={keywordLen} title='동성 친구만' onSelect={handleSelectKeyword} />
                     <PreferKeyword keywordLen={keywordLen} title='음주 X' onSelect={handleSelectKeyword} />
                     <PreferKeyword keywordLen={keywordLen} title='여러 개 주문해서 나눠먹기' onSelect={handleSelectKeyword} />
                     <PreferKeyword keywordLen={keywordLen} title='조용한 식사' onSelect={handleSelectKeyword} />
                     <PreferKeyword keywordLen={keywordLen} title='반려동물 동반 가능' onSelect={handleSelectKeyword} />
                  </div>
               </div>
            </div>
            <div className="flex w-full justify-around">
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
            <div className='flex w-full justify-around mt-2 mb-10 text-sm text-center text-gray-500'>
               <p className='w-[140px]'>* 뷔페와 같이 동일 가격의 식당에서 추천해요.</p>
               <p className=''>* 만나서 결제를 추천해요.</p>
            </div>
            {selectedPayment==='미리 결제'&&
            <div className='flex justify-center'>
            <Bills joinedPeople={joinedPeople} onUpdateBills={handleUpdateBills} />
            </div>
            }
            <div className='mb-[56px] w-full text-center'>
               <button
                  className={` left-0 right-0 mx-auto w-[70%] h-[56px] font-bold text-[20px] rounded-[40px] transition-all duration-700 
                  ${isButtonActive ? 'bg-[#D75B22] text-white' : 'bg-[#F5F5F5] text-[#BDBDBD]'}`}
                  onClick={() => {
                     if (isButtonActive) sendDetailInfo();
                  }}>
                  글 작성하기
               </button>
            </div>
         </div>
      </section>
   )
}


export default WriteTwo;
