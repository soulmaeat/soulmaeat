import React, { useState, ChangeEvent } from 'react';
import PreferTab from '../components/PreferTab';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Onboarding: React.FC = () => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedIntroduce, setSelectedIntroduce] = useState<string>('');
  const navigate = useNavigate();
  
  const handleSelectPreference = (title: string, isActive: boolean) => {
    setSelectedPreferences((prev) => {
      if (isActive) {
        return [...prev, title];
      } else {
        return prev.filter((item) => item !== title);
      }
    });
  };

  const handleIntroduceChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedIntroduce(event.target.value);
  };

  const isButtonEnabled = selectedPreferences.length > 0 && selectedPreferences.length <= 3;

  // 색상 변경을 위한 조건
  const warningTextColor = selectedPreferences.length > 3 ? 'text-red-500' : 'text-gray-400';

  const url = import.meta.env.VITE_API_URL;
  const handleNextButtonClick = async () => {
    if (isButtonEnabled) {
      try {
        const userId = sessionStorage.getItem('userId');
        
        await axios.post(`${url}/api/preference/${userId}`, {
          userPreference: selectedPreferences,
          introduce: selectedIntroduce,
        });

        navigate('/');
      } catch (error) {
        console.error('취향 저장 실패:', error);
        // 에러 처리
      }
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-5">
      <h2 className="text-2xl font-bold mt-8">밥 먹는 취향을 선택해주세요</h2>
      <hr className="w-full h-1 bg-gray-400 mt-4 mb-8" />
      <div className={`mb-5 text-sm ${warningTextColor}`}>취향 선택은 3개까지 가능합니다</div>
      <div className="mb-8">
        <PreferTab title="매운걸 못먹어요" onSelect={handleSelectPreference} />
        <PreferTab title="편식이 있어요" onSelect={handleSelectPreference} />
        <PreferTab title="빠르게 먹어요" onSelect={handleSelectPreference} />
        <PreferTab title="조용한 분위기를 좋아해요" onSelect={handleSelectPreference} />
        <PreferTab title="먹으면서 대화하는 거 좋아해요" onSelect={handleSelectPreference} />
        <PreferTab title="많이 먹어요" onSelect={handleSelectPreference} />
        <PreferTab title="낮은 칼로리 음식을 선호해요" onSelect={handleSelectPreference} />
        <PreferTab title="채식을 선호해요" onSelect={handleSelectPreference} />
        <PreferTab title="건강식을 선호해요" onSelect={handleSelectPreference} />
        <PreferTab title="음식을 차갑게 먹는 걸 선호해요" onSelect={handleSelectPreference} />
      </div>

      <div className="text-xl font-bold mb-2">소개글 작성</div>
      <textarea
        className="w-full h-40 border border-gray-300 rounded-lg p-2"
        placeholder="자신을 간단히 소개해 주세요"
        onChange={handleIntroduceChange}
        value={selectedIntroduce}
      ></textarea>
      <button
        className={`fixed bottom-12 left-0 right-0 mx-auto w-72 h-16 font-bold text-xl rounded-full transition duration-500 ${
          isButtonEnabled ? 'bg-[#D75B22] text-white' : 'bg-gray-200 text-gray-400'
        }`}
        onClick={handleNextButtonClick}
      >
        회원가입
      </button>
    </section>
  );
};

export default Onboarding;
