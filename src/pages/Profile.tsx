import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import TabBar from '../components/TabBar';
import { useWallet } from '../contexts/WalletContext';
import { UserData, UserInfo } from '../App';
import axios from 'axios';

interface ProfileProps {
  userData: UserData | null;
}

interface Post {
  author: string;
}

const Profile: React.FC<ProfileProps> = ({ userData }) => {
  const [firepower, setFirepower] = useState(36.5);
  const [currentFirepower, setCurrentFirepower] = useState(firepower);
  const navigate = useNavigate();
  const [userSoulpay, setUserSoulpay] = useState<number>(0);
  const {
    setUserSoulpay: setLocalUserSoulpay,
    setUserSoulpay: setGlobalUserSoulpay,
  } = useWallet();
  const [introduce, setIntroduce] = useState(userData?.user?.introduce || '');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const keywordArr = userData?.user?.userPreference?.[0]?.PreferenceList || [];
  // console.log(userData?.user?.userPreference?.[0]?.PreferenceList);
  const [activities, setActivities] = useState<Post[]>([]);

  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태

  const user = userData?.user || {
    userId: '',
    email: '',
    gender: '',
    age: 0,
    introduce: '',
    userPreference: [],
    userSoulpay: [],
  }; // 초기화

  useEffect(() => {
    const savedIntroduce = localStorage.getItem('introduce');
    if (savedIntroduce) {
      setIntroduce(savedIntroduce);
    }

    const storedSoulpay = localStorage.getItem('userSoulpay');
    if (storedSoulpay) {
      try {
        const parsedSoulpay = JSON.parse(storedSoulpay);
        setUserSoulpay(parsedSoulpay);
      } catch (error) {
        console.error('Failed to parse userSoulpay from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserSoulpay = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem('userInfo');
        const token: UserInfo = storedUserInfo
          ? JSON.parse(storedUserInfo).token
          : {};
        if (!token) {
          console.error('Token not found in sessionStorage');
          return;
        }

        const response = await axios.get('/api/user/soulpay', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { soulpay } = response.data;
        if (typeof soulpay === 'number' && !isNaN(soulpay)) {
          setUserSoulpay(soulpay);
          setLocalUserSoulpay(soulpay); // 로컬 상태에 저장
          localStorage.setItem('userSoulpay', soulpay.toString()); // 로컬 스토리지에 저장
          setGlobalUserSoulpay(soulpay); // 데이터에 반영
        } else {
          console.error('Invalid soulpay value:', soulpay);
        }
      } catch (error) {
        console.error('Failed to fetch userSoulpay:', error);
        // 사용자에게 에러 메시지 표시 또는 처리
      } finally {
        setIsLoading(false); // 로딩 상태 업데이트
      }
    };

    fetchUserSoulpay();
  }, [setLocalUserSoulpay, setGlobalUserSoulpay]);

  const handleEditingClick = () => {
    setIsEditing(true);
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  const handleSaveClick = async () => {
    try {
      const storedUserInfo = sessionStorage.getItem('userInfo');
      const token: UserInfo = storedUserInfo
        ? JSON.parse(storedUserInfo).token
        : {};
      if (!token) {
        console.error('Token not found in sessionStorage');
        return;
      }

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

  const updateUserSoulpayInSessionStorage = (soulpay: number) => {
    try {
      let storedUserInfo = sessionStorage.getItem('userInfo');
      let userInfo;
      if (!storedUserInfo) {
        userInfo = {
          user: {
            userSoulpay: soulpay,
          }
        };
      } else {
        userInfo = JSON.parse(storedUserInfo);
        userInfo.user = userInfo.user || {}; // Ensure user property exists
        userInfo.user.userSoulpay = soulpay;
      }
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to update userSoulpay in sessionStorage:', error);
      // Handle error appropriately
    }
  };  

  useEffect(() => {
    updateUserSoulpayInSessionStorage(userSoulpay);
  }, [userSoulpay]);

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

  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    const url = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get<{ posts: Post[] }>(`${url}/api/posts`);
      // console.log(response.data.posts);
      const userPosts = response.data.posts.filter(
        (post) => post.author === user.userId
      );
      userPosts.forEach((post) => {
        if (typeof post.author === 'string') {
          const authorPosts = response.data.posts.filter(
            (p: Post) => p.author === post.author
          );
          // console.log(post.author);
          // console.log(`${post.author}의 활동내역: ${authorPosts.length}`);
        }
      });
      setActivities(userPosts); // 필터링된 포스트를 상태로 설정
    } catch (err) {
      console.warn(err);
    }
  };

  // 로그아웃 클릭 이벤트 핸들러 함수
  const handleLogout = () => {
    // 여기에 로그아웃 처리 로직을 추가합니다.
    // 예를 들어, 세션 삭제, 사용자 정보 초기화 등을 수행할 수 있습니다.
    console.log('로그아웃 버튼 클릭됨');
    // 예시: localStorage나 sessionStorage에서 데이터 삭제
    localStorage.removeItem('userInfo');
    // 로그아웃 후 로그인 페이지로 리다이렉트
    navigate('/');
  };

  const maxFirepower = 100;
  const firepowerPercentage = (currentFirepower / maxFirepower) * 100;

  return (
    <section className="max-w-3xl mx-auto p-5 min-h-screen">
      <div className="flex items-center mb-4">
        <IoIosArrowBack size={35} />
        <h1 className="mx-2">마이페이지</h1>
        <button
          className="px-4 py-2 border ml-auto border-gray-500 text-sm font-medium rounded-md focus:outline-none"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>

      <div className="flex items-center mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden">
          <img
            src="/img/profile-image.png"
            alt="프로필 이미지"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-4">
          <p className="text-gray-700 font-semibold">{user.userId}</p>
          <p className="text-sm text-gray-400 font-medium">
            <span className="mr-1">{user.gender}</span>
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
            onClick={isEditing ? handleSaveClick : handleEditingClick}
          >
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
          <div className="flex items-end">
            <img
              src="/img/free-icon-campfire.png"
              alt="화력 이미지콘"
              className="w-full h-full object-cover"
            />
            <p className="text-customOrange">{`${currentFirepower.toFixed(
              1
            )}`}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 h-2 rounded-lg">
            <div
              className="bg-customOrange h-full rounded-lg"
              style={{ width: `${firepowerPercentage}%` }}
            ></div>
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
          <p className="mb-2 font-semibold">
            {userSoulpay ? userSoulpay.toLocaleString() : '0'} 소울
          </p>
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

      <div
        className="flex justify-between items-center mt-8 p-3 border-b"
        onClick={() => navigate('/activity')}
      >
        <div className="flex">
          <h2 className="mr-3 font-semibold text-gray-600">활동내역</h2>
          <span className="text-gray-700">{activities.length}</span>
        </div>
        <IoIosArrowForward />
      </div>

      <TabBar />
    </section>
  );
};

export default Profile;
