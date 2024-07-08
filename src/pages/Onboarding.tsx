import React from 'react';
import PreferTab from '../components/PreferTab';

const Onboarding: React.FC = () => {
  return (
    <section className="max-w-3xl mx-auto p-5">
      <h2 className="text-[24px] font-bold mt-[32px]">밥 먹는 취향을 선택해주세요</h2>
      <div className='h-[1px] w-[100%] bg-[#aaaaaa] mt-[14px] mb-[52px]'></div>

      <div className='mb-[36px]'>
        <PreferTab title="매운걸 못먹어요" />
        <PreferTab title="편식이 있어요" />
        <PreferTab title="빠르게 먹어요" />
        <PreferTab title="조용한 분위기를 좋아해요" />
        <PreferTab title="먹으면서 대화하는 거 좋아해요" />
        <PreferTab title="많이 먹어요" />
        <PreferTab title="낮은 칼로리 음식을 선호해요" />
        <PreferTab title="채식을 선호해요" />
        <PreferTab title="건강식을 선호해요" />
        <PreferTab title="음식을 차갑게 먹는 걸 선호해요" />
      </div>

      <div className="text-[20px] font-bold mb-[8px]">소개글 작성</div>
      <textarea
        className='w-full h-[160px] border border-[#D6D6D6] rounded-[12px] p-2'
        placeholder='자신을 간단히 소개해 주세요'></textarea>
      <button
        className='fixed bottom-[56px] left-0 right-0  mx-auto w-[360px] h-[56px] bg-[#F5F5F5] text-[#BDBDBD] font-bold text-[20px] rounded-[40px] '>
        다음
      </button>
    </section>
  )
}
export default Onboarding;
