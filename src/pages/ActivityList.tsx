import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import TabBar from '../components/TabBar';
import { PostData, UserData, UserInfo } from '../App';
import MainList from '../components/MainList';

interface ActivityListProps {
  postData: PostData[] | null;
  userData: UserData | null;
}

const ActivityList: React.FC<ActivityListProps> = ({ userData, postData }) => {
  const navigate = useNavigate();

  const storedUserInfo = sessionStorage.getItem('userInfo');
  const userId: string = storedUserInfo
    ? JSON.parse(storedUserInfo).userId
    : {};

    console.log(postData);

  const filteredPost = postData?.filter(post => post.author === userId);
  console.log(filteredPost)

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  return (
    <section className="max-w-3xl mx-auto p-5 min-h-screen relative">
      <div className="flex items-center mb-4">
        <IoIosArrowBack size={35} onClick={handleGoBack} />
        <h1 className="mx-2">활동내역</h1>
      </div>

      <p className="my-3 text-right">총 {filteredPost?.length}건</p>

      <div className="space-y-[14px] mb-[80px]">
        {postData?.length === 0 ? (
          <p>활동내역이 없습니다.</p>
        ) : (
          filteredPost?.map((activity, index) => (
            <div key={index}>
              <MainList post={activity} />
            </div>
          ))
        )}
      </div>

      <TabBar />
    </section>
  );
};

export default ActivityList;
