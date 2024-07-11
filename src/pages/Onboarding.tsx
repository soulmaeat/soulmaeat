import React, { useState, ChangeEvent } from 'react';
import PreferTab from '../components/PreferTab';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Onboarding: React.FC = () => {
  // selectedIntroduce의 초기값을 빈 문자열로 설정합니다.
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedIntroduce, setSelectedIntroduce] = useState<string>('');
  const navigate = useNavigate();

  // handleSelectPreference 함수는 PreferTab의 활성화 상태가 변경될 때마다 선택된 항목을 업데이트합니다.
  const handleSelectPreference = (title: string, isActive: boolean) => {
    setSelectedPreferences((prev) => {
      if (isActive) {
        return [...prev, title];
      } else {
        return prev.filter((item) => item !== title);
      }
    });
  };

  // handleIntroduceChange 함수는 소개글의 내용을 업데이트합니다.
  const handleIntroduceChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedIntroduce(event.target.value);
  };

  const isButtonEnabled = selectedPreferences.length > 0;

  const url = import.meta.env.VITE_API_URL;
  const handleNextButtonClick = async () => {
    if (isButtonEnabled) {
      try {
        const userId = sessionStorage.getItem('userId');
        // 백엔드에 선택된 선호도와 소개글을 보내는 API 호출
        
        await axios.post(`${url}/api/preference/${userId}`, {
          userPreference: selectedPreferences,
          introduce: selectedIntroduce,
        });

        // 요청이 성공하면 메인 페이지로 이동
        navigate('/');
      } catch (error) {
        console.error('Failed to save preferences:', error);
        // 에러 처리 로직 추가
      }
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-5">
      <h2 className="text-[20px] font-bold mt-[32px]">밥 먹는 취향을 선택해주세요</h2>
      <div className="h-[1px] w-[100%] bg-[#aaaaaa] mt-[14px] mb-[52px]"></div>

      <div className="mb-[36px]">
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

      <div className="text-[18px] font-bold mb-[8px]">소개글 작성</div>
      <textarea
        className="w-full h-[160px] border border-[#D6D6D6] rounded-[12px] p-2"
        placeholder="자신을 간단히 소개해 주세요"
        onChange={handleIntroduceChange}
        value={selectedIntroduce}
      ></textarea>
      <button
        className={`fixed bottom-[56px] left-0 right-0 mx-auto w-[360px] h-[56px] font-bold text-[20px] rounded-[40px] transition-all duration-700 ${
          isButtonEnabled ? 'bg-[#D75B22] text-white' : 'bg-[#F5F5F5] text-[#BDBDBD]'
        }`}
        onClick={handleNextButtonClick}
      >
        회원가입
      </button>
    </section>
  );
};

export default Onboarding;
