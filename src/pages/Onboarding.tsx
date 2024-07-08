import React, { useState } from 'react';
import PreferTab from '../components/PreferTab';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const navigate = useNavigate();

  //handleSelectPreference 함수는 PreferTab의 활성화 상태가 변경될 때마다 선택된 항목을 업데이트합니다.
  const handleSelectPreference = (title: string, isActive: boolean) => {
    setSelectedPreferences((prev) => {
      if (isActive) {
        return [...prev, title];
      } else {
        return prev.filter((item) => item !== title);
      }
    });
  };

  const isButtonEnabled = selectedPreferences.length > 0;
  //isButtonEnabled 변수를 사용하여 선택된 취향이 하나 이상이면 버튼의 스타일을 변경합니다.

  return (
    <section className="max-w-3xl mx-auto p-5">
      <h2 className="text-[24px] font-bold mt-[32px]">밥 먹는 취향을 선택해주세요</h2>
      <div className='h-[1px] w-[100%] bg-[#aaaaaa] mt-[14px] mb-[52px]'></div>

      <div className='mb-[36px]'>
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

      <div className="text-[20px] font-bold mb-[8px]">소개글 작성</div>
      <textarea
        className='w-full h-[160px] border border-[#D6D6D6] rounded-[12px] p-2'
        placeholder='자신을 간단히 소개해 주세요'></textarea>
      <button
        className={`fixed bottom-[56px] left-0 right-0 mx-auto w-[360px] h-[56px] font-bold text-[20px] rounded-[40px] transition-all duration-700 ${isButtonEnabled ? 'bg-[#D75B22] text-white' : 'bg-[#F5F5F5] text-[#BDBDBD]'}`} 
        onClick={() => navigate('/main')}>
        다음
      </button>
      //다음버튼 누르면 메인페이지 연결
    </section>
  );
}

export default Onboarding;
