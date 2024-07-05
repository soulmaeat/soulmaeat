// Profile.tsx

import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';
import TabBar from '../components/TabBar';

// 상수 데이터 분리
const keywords = [
  "# 많이 먹어요",
  "# 조용한 분위기를 좋아해요",
  "# 편식 안해요",
  "# 사진 찍는 것을 좋아합니다",
];

// 프로필 이미지 컴포넌트
const ProfileImage = () => (
  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
    {/* <img src="/img/profile-image.jpg" alt="프로필 이미지" className="w-full h-full object-cover" /> */}
  </div>
);

// 성향 키워드 컴포넌트
interface KeywordsListProps {
  keywords: string[];
}

const KeywordsList: React.FC<KeywordsListProps> = ({ keywords }) => (
  <div className="overflow-x-auto">
    <ul className="flex whitespace-nowrap">
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
  </div>
);

interface ProfileProps {
  firepower?: number;
}

const Profile: React.FC<ProfileProps> = ({ firepower = 36.5 }) => {
  // 화력 값 0과 100 사이로 정규화
  // const normalizedFirepower = ((firepower - 36.5) / (100 - 36.5)) * 100;

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
          <Link to="#" className="cursor-pointer text-sm underline">수정</Link>
        </div>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <p className="text-sm">안녕. 나는 건대 사는 돼지파티야. 나는 3인분도 먹을 수...</p>
        </div>
      </div>
      
      <div className="relative mt-8">
        <div className="flex justify-between items-end mb-2">
          <h2 className="font-semibold text-gray-500">나의 화력</h2>
          <div className='flex items-end'>
            <img src="/img/free-icon-campfire.png" alt="화력 이미티콘" className="w-full h-full object-cover" />
            <p className="text-customOrange text-sm">{`${firepower.toFixed(1)}`}</p>
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
          <p className="mb-2 font-semibold">100,000 소울</p>
        </div>
        <div className="self-end">
          <button className="px-4 py-2 bg-customOrange text-xs text-white font-medium rounded-md focus:outline-none">
            <Link to="#">충전하기</Link>
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
