import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import TabBar from '../components/TabBar';
import { useWallet } from '../contexts/WalletContext';
import { UserData, UserInfo } from '../App';
import axios from 'axios';

interface ProfileProps {
  userData: UserData | null;
}

const Profile = ({ userData }: ProfileProps) => {
  const [firepower, setFirepower] = useState(36.5);
  const navigate = useNavigate();
  const { soulBalance } = useWallet();
  const [introduce, setIntroduce] = useState(userData?.user?.introduce || '');
  const [isEditing, setIsEditing] = useState(false); 
  const [error, setError] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [currentFirepower, setCurrentFirepower] = useState(firepower);

  const user = userData?.user || {
    userId: '',
    email: '',
    gender: '',
    age: 0,
    introduce: '',
    userPreference: [],
    userSoulpay: [],
  }; // 초기화
  
  const keywordArr = userData?.user?.userPreference?.[0]?.PreferenceList || [];
  // console.log(userData?.user?.userPreference?.[0]?.PreferenceList);

  useEffect(() => {
    const savedIntroduce = localStorage.getItem('introduce');
    if (savedIntroduce) {
      setIntroduce(savedIntroduce);
    }
  }, []);

  const handleEditingClick = () => {
    setIsEditing(true);
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  const storedUserInfo = sessionStorage.getItem('userInfo');
  const token: UserInfo = storedUserInfo ? JSON.parse(storedUserInfo).token : {};

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        'http://localhost:3000/api/edit',
        { email: userData?.user?.email, introduce },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem('introduce', introduce);
      console.log(response.data); // 성공적으로 업데이트된 경우 처리
    } catch (error) {
      console.error('Error updating introduction:', error);
    }
    setIsEditing(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 50) {
      setIntroduce(e.target.value);
      setError('');
    } else {
      setError('글자 수는 50자 이내여야 합니다.');
    }
  };

  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isEditing]);

  // 최대 화력 값을 설정
  const maxFirepower = 100;
  // currentFirepower의 퍼센트를 계산
  const firepowerPercentage = (currentFirepower / maxFirepower) * 100;

  return (
    <section className="max-w-3xl mx-auto p-5 min-h-screen">
      <div className="flex items-center mb-4">
        <IoIosArrowBack size={35}/>
        <h1 className="mx-2">마이페이지</h1>
        {/* 로그아웃 */}
      </div>

      <div className="flex items-center mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden">
          <img src="/img/profile-image.png" alt="프로필 이미지" className="w-full h-full object-cover" />
        </div>
        <div className="ml-4">
          <p className="text-gray-700 font-semibold">{user.userId}</p>
          <p className="text-sm text-gray-400 font-medium">
            <span className='mr-1'>{user.gender}</span>
            {/* <span>{user.age && Math.floor(user.age / 10) * 10}대</span> */}
            <span>{user.age}</span>
          </p>
        </div>
      </div>

      <h2 className="font-semibold mt-8 mb-2 text-gray-600">성향 키워드</h2>
      <div className="leading-8">
      {keywordArr.map((keyword: string, i: number) => (
        <span
          key={i}
          className="border border-[#D75B22] rounded-3xl text-[#D75B22] bg-[#FFEFE8] px-2 py-0.5 mr-2 text-nowrap"
        >
          # {keyword}
        </span>
      ))}
      </div>

      <div className="mt-8 text-gray-600">
        <div className="flex justify-between">
          <h2 className="font-semibold mb-2">소개글</h2>
          <button 
            className="cursor-pointer text-sm underline" 
            onClick={isEditing ? handleSaveClick : handleEditingClick}>
            {isEditing ? '완료' : '수정'}
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <textarea
            className="block w-full bg-gray-100 rounded-md"
            value={introduce}
            onChange={handleInputChange}
            ref={textAreaRef}
            placeholder={'자기소개를 입력해 주세요.'}
            disabled={!isEditing}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
      
      <div className="relative mt-8">
        <div className="flex justify-between items-end mb-2">
          <h2 className="font-semibold text-gray-500">나의 화력</h2>
          <div className='flex items-end'>
            <img src="/img/free-icon-campfire.png" alt="화력 이미지콘" className="w-full h-full object-cover" />
            <p className="text-customOrange">{`${currentFirepower.toFixed(1)}`}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 h-2 rounded-lg">
            {/* firepowerPercentage를 이용해 너비 설정 */}
            <div className="bg-customOrange h-full rounded-lg" style={{ width: `${firepowerPercentage}%` }}></div>
          </div>
        </div>
        {/* <div className="mt-4 flex justify-end">
          <button 
            className="px-4 py-2 bg-customOrange text-sm text-white font-medium rounded-md focus:outline-none"
            onClick={() => setCurrentFirepower(prev => Math.min(prev + 10, maxFirepower))}
          >
            화력 증가
          </button>
        </div> */}
      </div>

      <div className="flex flex-col mt-8 mb-4 p-4 border border-gray-300 rounded-md">
        <div className="flex justify-between mb-2">
          <h2 className="font-semibold">소울페이</h2>
          <p className="mb-2 font-semibold">{soulBalance.toLocaleString()} 소울</p>
        </div>
        <div className="self-end">
          <button 
            className="px-4 py-2 bg-customOrange text-sm text-white font-medium rounded-md focus:outline-none"
            onClick={() => navigate('/charge')}
          >
            충전하기
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 p-3 border-b"
        onClick={() => navigate('/activity')}>
        <div className="flex">
          <h2 className="mr-3 font-semibold text-gray-600">활동내역</h2>
          <span className="text-gray-700">7</span>
        </div>
        <IoIosArrowForward />
      </div>
      
      <TabBar/>
    </section>
  );
};

export default Profile;
