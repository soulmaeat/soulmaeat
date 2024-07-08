import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import TabBar from '../components/TabBar';
import { useWallet } from '../contexts/WalletContext';

const keywords = [
  "# 많이 먹어요",
  "# 조용한 분위기를 좋아해요",
  "# 사진 찍는 것을 좋아합니다",
];

const ProfileImage = () => (
  <div className="w-14 h-14 rounded-full overflow-hidden">
    <img src="/img/profile-image.png" alt="프로필 이미지" className="w-full h-full object-cover" />
  </div>
);

interface KeywordsListProps {
  keywords: string[];
}

const KeywordsList: React.FC<KeywordsListProps> = ({ keywords }) => (
  <ul className="flex flex-wrap text-nowrap">
    {keywords.length > 0 ? (
      keywords.map((keyword, index) => (
        <li key={index} className="inline px-2 py-0.3 mb-2 mr-2 font-semibold text-customOrange border bg-customapricot border-customOrange rounded-2xl">
          {keyword}
        </li>
      ))
    ) : (
      <li className="text-gray-500">키워드가 없습니다.</li>
    )}
  </ul>
);

interface ProfileProps {
  firepower?: number;
}

const Profile: React.FC<ProfileProps> = ({ firepower = 36.5 }) => {
  const navigate = useNavigate();
  const { soulBalance } = useWallet();
  const [isEditing, setIsEditing] = useState(false);
  const [introduction, setIntroduction] = useState('여기에 소개글이 들어갑니다..');
  const [error, setError] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [currentFirepower, setCurrentFirepower] = useState(firepower);

  const handleEditingClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    setError("");
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 50) {
      setIntroduction(e.target.value);
      setError("");
    } else {
      setError("글자 수는 50자 이내여야 합니다.");
    }
  };

  useEffect(()=>{
    if(isEditing && textAreaRef.current){
      textAreaRef.current.focus();
    }
  }, [isEditing]);

  return (
    <section className="max-w-3xl mx-auto p-5 min-h-screen">
      <div className="flex items-center mb-4">
        <IoIosArrowBack size={35}/>
        <h1 className="mx-2">마이페이지</h1>
      </div>

      <div className="flex items-center mb-4">
        <ProfileImage />
        <div className="ml-4">
          <p className="text-gray-700 font-semibold">돼지파티</p>
          <p className="text-gray-400 font-medium">건대</p>
        </div>
      </div>

      <h2 className="font-semibold mt-8 mb-2 text-gray-600">성향 키워드</h2>
      <KeywordsList keywords={keywords} />
      
      <div className="mt-8 text-gray-600">
        <div className="flex justify-between">
          <h2 className="font-semibold mb-2">소개글</h2>
          <button className="cursor-pointer text-sm underline" 
            onClick={isEditing ? handleSaveClick : handleEditingClick}>
            {isEditing ? '완료' : '수정'}
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          {isEditing ? (
            <>
              <textarea
                className="block w-full bg-gray-100 rounded-md"
                value={introduction}
                onChange={handleInputChange}
                ref={textAreaRef}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          ):(
            <p className="text-sm">{introduction}</p>
          )}
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
            <div className="bg-customOrange h-full rounded-lg" style={{ width: `30%` }}></div>
          </div>
        </div>
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

      <div className="flex justify-between mt-8 pb-3 border-b">
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
