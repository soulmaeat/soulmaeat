import { useState, useEffect, FC, ChangeEvent } from 'react';
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
  date: string;
  currentTime: string;
  meeingTime: string;
  isDone: boolean;
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
   const [restTime, setRestTime] = useState<number>(1800000); // 30분
   const [now, setNow] = useState<Date>(new Date());
   const [year, setYear] = useState<number>(now.getFullYear());
   const [month, setMonth] = useState<string>(String(now.getMonth() + 1).padStart(2, '0')); // padStart(2, '0')으로 2자리수로 맞춰줌
   const [day, setDay] = useState<string>(String(now.getDate()).padStart(2, '0'));
   const [meetingDate, setMeetingDate] = useState<string>(`${year}-${month}-${day}`); // 기본: 오늘 날짜
   const [recoTime, setRecoTime] = useState<string>(new Date(now.getTime() + restTime).toTimeString().slice(0, 5));
   const [msg, setMsg] = useState<string>(''); // 시간이 지났을 때 메시지
   const [dateMgs, setDateMsg] = useState<string>(''); // 날짜가 지났을 때 메시지
   const [restTimer, setRestTimer] = useState<any>(null);
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

   useEffect(()=>{ // 시간 데이터 확인
    console.log('--------------------------------------');
    console.log('만나는 일자 : ',meetingDate);
    console.log('현재 시간 : ',now.toTimeString().slice(0, 5));
    console.log('만나는 시간 : ',recoTime);
    console.log('남은 시간 : ',restTimer);
    const millisecondsInASecond = 1000;
    const millisecondsInAMinute = millisecondsInASecond * 60;
    const millisecondsInAnHour = millisecondsInAMinute * 60;
    const millisecondsInADay = millisecondsInAnHour * 24;
    let restTime = restTimer;
    const days = Math.floor(restTime / millisecondsInADay);
    restTime %= millisecondsInADay; // 계산하고 남은 나머지 값 (days단위보다 작은 값)
    const hours = Math.floor(restTime / millisecondsInAnHour);
    restTime %= millisecondsInAnHour; // 계산하고 남은 나머지 값 (hours단위보다 작은 값)
    const minutes = Math.floor(restTime / millisecondsInAMinute);
    console.log(`${days}일 ${hours}시간 ${minutes}분`);
   },[meetingDate, recoTime, restTimer])

   useEffect(()=>{ // 새로고침해도 선택한 장소 유지
      if(selectPlace!==beforeSelectedPlace){
         if(!selectPlace){
            alert('잘못된 접근입니다.');
            navigate('/main');
         }
         if(beforeSelectedPlace){
            if(selectPlace.id===beforeSelectedPlace.id)return;
         }
         setBeforeSelectedPlace(selectPlace);
         localStorage.setItem('selectedPlace', JSON.stringify(selectPlace));
      }
   },[selectPlace])
   
   useEffect(() => { // 글 작성하기 버튼 활성화
      if (title && description && selectedPayment && !msg && !dateMgs) {
         if(selectedPayment==='미리 결제'){ // 미리 결제 선택 시
            if(allBills&&allBills.billsList.length>0){ // 영수증 값이 존재해야 글 작성 가능
               setIsButtonActive(true);
         }else {setIsButtonActive(false);}
      }else{
         setIsButtonActive(true);
      }
   }else{
      setIsButtonActive(false);
   }
   }, [title, description, selectedPayment, msg, dateMgs, allBills]);

   useEffect(() => { // data를 보낼 때 현재 시간과 만남 시간을 비교하여 시간 차이 계산하기 위함
      const diffTime = new Date(`${meetingDate} ${recoTime}`).getTime() - now.getTime();
      setRestTimer(diffTime);
   },[meetingDate, recoTime])

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
        date: meetingDate,
        currentTime: now.toTimeString().slice(0, 5),
        meeingTime: recoTime,
        isDone: false,
    };
    console.log(data);
    try {
      // setTimeout(() => {
      //    // restTimer 만큼 시간이 지나면 모집완료 덮어쓰기
      //    // get으로 먼저 아이디 조회?
      //    // await axios.put(`${url}/api/post/${postId}`, { isDone: true });
      //    // alert(postId의+'모집이 완료되었습니다.');
      // }, restTimer);
      // setTimeout(() =>{
      //   // restTimer-600000 만큼 시간이 지나면 => 10분 전 알림
      // }, restTimer-600000);
      setTimeout(() => {
         alert('10초가 지나 모집이 완료되었습니다.')
      },10000); //

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

   // 만남시간, 날짜가 다음날로 설정되어있으면 시간 제한 X 당일이면 지난 시간 선택 불가
   const onChangeTimeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setRecoTime(e.target.value)
      const selectedTime = new Date(`${meetingDate} ${e.target.value}`);
      const currentTime = new Date();
      const diffTime = selectedTime.getTime() - currentTime.getTime();
      if (diffTime < 0) {
         setMsg('*지난 시간을 선택할 수 없습니다.');
      } else {
         setMsg('');
      }
      // 현재 시간도 적용 되도록
      setNow(new Date());
   }

   const todayHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setMeetingDate(e.target.value);
      const selectedDate = new Date(e.target.value);
      const currentTime = new Date();
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 하루를 밀리초로 환산
      const diffTime = selectedDate.getTime() - currentTime.getTime();
      if (diffTime < -oneDayInMilliseconds) { // 당일까지 선택 가능하도록
         setDateMsg('*지난 날짜를 선택할 수 없습니다.');
      } else {
         setDateMsg('');
      }
      // 현재 날짜도 적용 되도록
      setNow(new Date());
   }

   return (
      <section className="max-w-3xl mx-auto min-h-screen">
         <NavBar title="글 작성하기" />
         <div className='p-4'>
            <div className="text-[20px] font-bold px-5">글을 작성해주세요</div>
            <div className='mt-[20px] mb-[32px] w-[100%] h-[1px] bg-[#888888]'></div>
            {selectPlace&&
            <div className='flex justify-between mb-8 mx-3'>
            {selectPlace&&
               <dl className='flex flex-col justify-center'>
                  <dt className='text-md'>{selectPlace.place_name}</dt>
                  <dd className='text-sm font-thin'>{selectPlace.road_address_name}</dd>
               </dl>
            }
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
               className='w-full h-[50px] mb-4 border border-[#D6D6D6] rounded-[12px] p-2 py-3'
               placeholder='제목을 입력해 주세요'
               value={title}
               onChange={(e) => setTitle(e.target.value)}
            ></textarea>
            <div className='mb-6'>
               <div className='text-md mb-2 px-3 font-bold'>모집 시간 &nbsp;
                  <div className='font-thin text-sm mt-2'>
                      * 정확한 날짜와 시간을 입력해주세요.
                  </div>
               </div>
               <div className='px-3 mb-1'>
                  <input 
                  type='date' 
                  onChange={todayHandler}
                  value={meetingDate}
                  min={meetingDate} // 오늘 날짜를 최소 선택 날짜로 설정
                  className='w-[140px] h-[40px] border border-[#D6D6D6] rounded-[12px] p-2 py-3'
                  />
               </div>
               <div className='flex items-center mb-1'>
                  <div className='w-[140px] whitespace-nowrap text-red-500 text-xs ml-2'>{dateMgs}</div>
                  <div className='w-[140px] whitespace-nowrap text-red-500 text-xs ml-6'>{msg}</div>
               </div>
               <div className='flex items-center px-3'>
                  <div className='flex items-center'>
                     <input disabled
                        type='time'
                        value={now.toTimeString().slice(0, 5)}
                        className='w-[140px] h-[40px] border border-[#D6D6D6] rounded-[12px] p-2 py-3'
                     />
                     <div className='mx-2'>~</div>
                     <input
                        type='time'
                        // step={1800}
                        value={recoTime}
                        onChange={onChangeTimeHandler}
                        className='w-[140px] h-[40px] border border-[#D6D6D6] rounded-[12px] p-2 py-3'
                     />
                  </div>
               </div>
               <div className='flex items-center mt-1 text-gray-500 text-sm px-3'>
                  <p className='ml-2 w-[140px]'>*현재 시간</p>
                  <p className='ml-6 w-[140px]'>*만남 시간</p>
               </div>
            </div>
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
