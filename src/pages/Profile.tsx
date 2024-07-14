// Profile.tsx
import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { UserData, PostData } from '../App'; // PostData 추가
import { NavBar } from '../components/NavBar';
import TabBar from '../components/TabBar';
import axios from 'axios';

interface ProfileProps {
  userData: UserData | null;
  postData: PostData[]; // postData 추가
}

const Profile: React.FC<ProfileProps> = ({ userData, postData }) => {
  const navigate = useNavigate();
  const { userSoulpay, setUserSoulpay } = useWallet(); // WalletContext에서 userSoulpay 상태와 업데이트 함수를 호출
  const [introduce, setIntroduce] = useState(userData?.user?.introduce || '');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const keywordArr = userData?.user?.userPreference?.[0]?.PreferenceList || [];
  const [activities, setActivities] = useState<PostData[]>([]); // Post 타입을 PostData로 변경
  const [isLogin, setIsLogin] = useState<boolean>(false);
  
  console.log(userData?.user?.userSoulpay);
  
  useEffect(() => {
    // 로컬 스토리지에서 저장된 소개글 불러오기
    const savedIntroduce = localStorage.getItem(`introduce_${userData?.user?.userId}`);
    if (savedIntroduce) {
      setIntroduce(savedIntroduce);
    }
    // userData가 변경될 때 사용자의 소개글, 활동 내역, 소울페이 최신화
    if (userData?.user?.userId) { // 사용자 데이터가 존재할 때만 데이터를 가져오기
      setIsLogin(true);
      setIntroduce(userData?.user?.introduce || '');
      fetchActivities(userData.user.userId); // 사용자 ID를 파라미터로 전달
      fetchUserSoulpay(userData.user.userId);
      fetchUserSoulpay(userData.user.userId);
    } else {
      setIsLogin(false);
    }
  }, [userData]);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    setIsLogin(false);
    localStorage.clear();
    sessionStorage.removeItem('userInfo');
    navigate('/');
  };

  // 사용자의 활동 내역을 가져오는 함수
  const fetchActivities = async (userId: string) => {
    // postData에서 해당 사용자의 활동 내역을 필터링하여 설정
    const userPosts = postData.filter((post) => post.author === userId);
    setActivities(userPosts);

    // 화력 업데이트
    updateFirepower(userPosts.length);
  };

  // 화력을 업데이트하는 함수
  const updateFirepower = (postCount: number) => {
    const baseFirepower = 36.5;
    const additionalFirepower = postCount * 5;
    const updatedFirepower = baseFirepower + additionalFirepower;
    setCurrentFirepower(updatedFirepower);
  };

  // 화력 관련 변수
  const [currentFirepower, setCurrentFirepower] = useState(36.5);
  const maxFirepower = 100;
  const firepowerPercentage = (currentFirepower / maxFirepower) * 100;

  // 사용자의 소울페이 정보 가져오는 함수
  const fetchUserSoulpay = async (userId: string) => {
    try {
      const response = await axios.get<{ soulpay: number }>(`http://localhost:3000/api/charge?userId=${userId}`);
      const { soulpay } = response.data;
      setUserSoulpay(soulpay);
      localStorage.setItem('userSoulpay', soulpay.toString());
    } catch (error) {
      console.error('사용자 소울페이 가져오기 오류:', error);
    }
  };

  // 소개글 입력 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 50) {
      setIntroduce(e.target.value);
      setError('');
      localStorage.setItem(`introduce_${userData?.user?.userId}`, e.target.value);
    } else {
      setError('글자 수는 50자 이내여야 합니다.');
    }
  };

  // 수정 버튼 클릭 시 호출되는 함수
  const handleEditingClick = () => {
    setIsEditing(true);
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  // 저장 버튼 클릭 시 호출되는 함수
  const handleSaveClick = async () => {
    try {
      const storedUserInfo = sessionStorage.getItem('userInfo');
      const token = storedUserInfo ? JSON.parse(storedUserInfo).token : {};

      if (!token) {
        console.error('세션 스토리지에서 토큰을 찾을 수 없습니다.');
        return;
      }

      await axios.put(
        'http://localhost:3000/api/edit',
        { email: userData?.user?.email, introduce },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 업데이트된 소개글을 로컬 스토리지에 저장
      localStorage.setItem(`introduce_${userData?.user?.userId}`, introduce);

      // UI에 반영하기 위해 상태 업데이트
      setIntroduce(introduce);
      setIsEditing(false); // 저장 후 수정 모드 비활성화

    } catch (error) {
      console.error('소개글 업데이트 중 오류 발생:', error);
    }
  };

  return (
    <>
      <NavBar title="마이페이지" />
      <section className="max-w-3xl mx-auto px-5 pb-5 min-h-screen">
        {!isLogin && (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center mb-11">
              <p className="mb-5">회원정보를 확인하기 위해 로그인이 필요합니다.</p>
              <button
                className="px-4 py-2 h-[40px] border ml-auto bg-customOrange text-white text-sm font-medium rounded-md focus:outline-none"
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
                  <p className="text-gray-700 font-semibold">{userData?.user?.userId}</p>
                  <p className="text-sm text-gray-400 font-medium">
                    <span className="mr-1">{userData?.user?.gender}</span>
                    <span>{userData?.user?.age}</span>
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
                  <p className="text-customOrange">{`${currentFirepower.toFixed(1)}`}</p>
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
