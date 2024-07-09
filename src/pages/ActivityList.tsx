import React from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import MainList from '../components/MainList';
import TabBar from '../components/TabBar';

const activities = [
  { date: '2024-07-01', content: '첫 번째 활동 내용' },
  { date: '2024-07-02', content: '두 번째 활동 내용' },
  { date: '2024-07-03', content: '세 번째 활동 내용' },
  { date: '2024-07-04', content: '네 번째 활동 내용' },
  { date: '2024-07-05', content: '다섯 번째 활동 내용' },
];

export default function ActivityList() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  return (
    <section className="max-w-3xl mx-auto p-5 min-h-screen relative">
      <div className="flex items-center mb-4">
        <IoIosArrowBack size={35} onClick={handleGoBack} />
        <h1 className="mx-2">활동내역</h1>
      </div>

      <p className="my-3 text-right">총 {activities.length}건</p>

      <div className="space-y-[14px] mb-[80px]">
        {activities.length === 0 ? (
          <p>활동내역이 없습니다.</p>
        ) : (
          activities.map((activity, index) => (
            <div key={index}>
              <p className="mb-2 font-semibold text-sm">{activity.date}</p>
              <MainList content={activity.content} />
            </div>
          ))
        )}
      </div>

      <TabBar />
    </section>
  );
}
