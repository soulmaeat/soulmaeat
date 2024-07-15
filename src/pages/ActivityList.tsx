import React, { useEffect, useState, Component } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TabBar from '../components/TabBar';
import { PostData, UserData } from '../App';
import MainList from '../components/MainList';

interface Post {
  post: PostData;
  date: string;
  content: string;
  author: string;
  selectedKeyword: [
    {
      likeList: string[];
      _id: string;
    }
  ];
}

interface ActivityListProps {
  userData: UserData | null;
}

const ActivityList: React.FC<ActivityListProps> = ({ userData }) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Post[]>([]); // 사용자 활동 내역 상태 관리
  const user = userData?.user || {
    userId: '',
  }
  
  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
  const url = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get<{ posts: Post[] }>(`${url}/api/posts`);
    const userPosts = response.data.posts.filter(post => post.author === user.userId);
    userPosts.forEach(post => {
      if (typeof post.author === 'string') {
        const authorPosts = response.data.posts.filter((p: Post) => p.author === post.author);
        console.log(post.author);
        console.log(`${post.author}의 활동내역: ${authorPosts.length}`);
      }
    });
    setActivities(userPosts); // 필터링된 포스트를 상태로 설정
  } catch (err) {
    console.warn(err);
    }
  };

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
              <MainList post={{ ...activity}} />
            </div>
          ))
        )}
      </div>

      <TabBar />
    </section>
  );
};

export default ActivityList;
