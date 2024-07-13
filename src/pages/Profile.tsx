import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { UserData, UserInfo } from '../App';
import { NavBar } from '../components/NavBar';
import TabBar from '../components/TabBar';
import axios from 'axios';

interface ProfileProps {
  userData: UserData | null;
}

interface Post {
  author: string;
}

const Profile: React.FC<ProfileProps> = ({ userData }) => {
  const navigate = useNavigate(); // React Router의 네비게이션 기능을 사용하기 위한 hook
  const [firepower, setFirepower] = useState(36.5); // 화력 상태와 관련된 state와 setter 함수
  const [currentFirepower, setCurrentFirepower] = useState(firepower); // 현재 화력 상태를 관리하는 state
  const { userSoulpay, setUserSoulpay } = useWallet(); // WalletContext에서 소울페이 관련 상태 및 함수 가져오기
  const [introduce, setIntroduce] = useState(userData?.user?.introduce || ''); // 사용자 소개글 상태 관리
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태 관리
  const [error, setError] = useState(''); // 오류 메시지 상태 관리
  const textAreaRef = useRef<HTMLTextAreaElement>(null); // 텍스트 에어리어 Ref 객체
  const keywordArr = userData?.user?.userPreference?.[0]?.PreferenceList || []; // 사용자 성향 키워드 배열
  const [activities, setActivities] = useState<Post[]>([]); // 사용자 활동 내역 상태 관리
  const [isLogin, setIsLogin] = useState<boolean>(false);

  // 사용자 객체 초기화
  const user = userData?.user || {
    userId: '',
    email: '',
    gender: '',
    age: 0,
    introduce: '',
    userPreference: [],
    userSoulpay: 0, // 초기값 0으로 설정
  };

  // 로컬 스토리지에서 저장된 소개글 불러오기
  useEffect(() => {
    const savedIntroduce = localStorage.getItem(`introduce_${user.userId}`);
    if (savedIntroduce) {
      setIntroduce(savedIntroduce);
    }
    if(user.userId){
      setIsLogin(true);
    }
  }, [user.userId]);

  // userData가 변경될 때 사용자의 소개글을 최신화
  useEffect(() => {
    setIntroduce(userData?.user?.introduce || '');
  }, [userData]);

  // 소울페이 값이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(`userSoulpay_${user.userId}`, String(userSoulpay));
  }, [userSoulpay, user.userId]);

  // 로컬 스토리지에서 저장된 소울페이 불러오기
  // useEffect(() => {
  //   const savedUserSoulpay = localStorage.getItem(`userSoulpay_${user.userId}`);
  //   if (savedUserSoulpay) {
  //     setUserSoulpay(JSON.parse(savedUserSoulpay));
  //   }
  // }, [user.userId, setUserSoulpay]);

  useEffect(() => {
    try {
      const savedUserSoulpay = localStorage.getItem(
        `userSoulpay_${user.userId}`
      );
      if (savedUserSoulpay) {
        setUserSoulpay(JSON.parse(savedUserSoulpay));
      }
    } catch (error) {
      console.error(
        'localStorage에서 userSoulpay 가져오는 중 오류 발생:',
        error
      );
      // 오류 처리 방법 추가 (예: 기본값 설정 등)
    }
  }, [user.userId, setUserSoulpay]);

  // 사용자 소개글 입력 시 처리하는 함수
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 50) {
      setIntroduce(e.target.value);
      setError('');
      localStorage.setItem(`introduce_${user.userId}`, e.target.value); // 소개글을 로컬 스토리지에 저장
    } else {
      setError('글자 수는 50자 이내여야 합니다.');
    }
  };

  // 수정 버튼 클릭 시 호출되는 함수
  const handleEditingClick = () => {
    setIsEditing(true);
    // 텍스트 에어리어에 포커스를 주는 코드 추가
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };


  // 저장 버튼 클릭 시 호출되는 함수
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
        { email: userData?.user?.email, introduce, userSoulpay },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 업데이트된 소개글을 로컬 스토리지에 저장
      localStorage.setItem(`introduce_${user.userId}`, introduce);

      // 업데이트된 소울페이 값을 상태에 반영
      setUserSoulpay(response.data.updatedUser.userSoulpay);

      // 업데이트된 소울페이 값을 로컬 스토리지에 저장
      localStorage.setItem(
        `userSoulpay_${user.userId}`,
        String(response.data.updatedUser.userSoulpay)
      );

      setIsEditing(false); // 수정 모드 종료

      console.log('User data updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating introduction:', error);
    }
  };

  // 활동 내역 불러오기
  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    const url = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get<{ posts: Post[] }>(`${url}/api/posts`);
      const userPosts = response.data.posts.filter(
        (post) => post.author === user.userId
      );
      setActivities(userPosts);
    } catch (err) {
      console.warn(err);
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    setIsLogin(false);
    localStorage.clear(); // 로컬 스토리지 클리어
    sessionStorage.removeItem('userInfo'); // 세션 스토리지 클리어

    navigate('/'); // 로그아웃 후 홈 페이지로 이동
  };

  // 화력 관련 변수
  const maxFirepower = 100;
  const firepowerPercentage = (currentFirepower / maxFirepower) * 100;

  return (
    <>
      <NavBar title="마이페이지" />
      <section className="max-w-3xl mx-auto px-5 pb-5 min-h-screen">
        {!isLogin && (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <p className="mb-5">회원정보를 확인하기 위해 로그인이 필요합니다.</p>
              <button
                className="px-4 py-2 h-[40px] border ml-auto border-gray-500 text-sm font-medium rounded-md focus:outline-none"
                onClick={()=>{navigate('/')}}
              >
                로그인
              </button>
            </div>
          </div>
        )}
        {isLogin && (
          <div>
            <div className="flex items-center">
              <div className="flex items-center">
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
              <button
                className="px-4 py-2 h-[40px] border ml-auto border-gray-500 text-sm font-medium rounded-md focus:outline-none"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>

            <h2 className="font-semibold mt-8 mb-2 text-gray-600">
              성향 키워드
            </h2>
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
              <div
                className="bg-gray-100 p-4 rounded-md mb-4"
                onClick={handleEditingClick}
              >
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
            </div>

            <div className="flex flex-col mt-8 mb-4 p-4 border border-gray-300 rounded-md">
              <div className="flex justify-between mb-2">
                <h2 className="font-semibold">소울페이</h2>
                <p className="mb-2 font-medium">
                  {userSoulpay.toLocaleString()}
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
          </div>
        )}
        <TabBar />
      </section>
    </>
  );
};

export default Profile;
