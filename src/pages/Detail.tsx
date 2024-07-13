import '../App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { kakao } from '../App';
// type
import { ModalInfo } from '../components/Modals';
import { UserData, PostData, UserInfo } from '../App';
// components
import { Modals } from '../components/Modals';
import { IoHomeOutline } from 'react-icons/io5';
import { IoIosArrowBack } from 'react-icons/io';
import axios from 'axios';

interface DetailProps {
  storedUserInfo: UserInfo | null;
  postData: PostData[];
  userData: UserData | null;
}

export const Detail: React.FC<DetailProps> = ({ userData, postData }) => {
  const { id } = useParams();

  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [joinModal, setJoinModal] = useState<boolean | undefined>(false);
  const [filteredPost, setFilteredPost] = useState<PostData | null>(null);
  const [joinCount, setJoinCount] = useState<number>(() => {
    // 초기값 설정 시 로컬스토리지에서 값 불러오기
    const savedJoinCount = localStorage.getItem('joinCount');
    return savedJoinCount ? parseInt(savedJoinCount, 10) : 1;
  });

  const navigate = useNavigate();
  const preferenceArr = userData?.user.userPreference[0].PreferenceList || [];
  const likeArr = filteredPost?.selectedKeyword[0].likeList || [];

  console.log(filteredPost);

  useEffect(() => {
    const filtered = postData.find((post) => post._id === id);
    if (filtered) {
      setFilteredPost(filtered);
    }
  }, [id, postData]);

  useEffect(() => {
    if (filteredPost) {
      loadKakaoMap();
    }
  }, [filteredPost]);

  const loadKakaoMap = () => {
    if (kakao) {
      const container = document.getElementById('map');
      const options = {
        // 건대 입구역 기준
        center: new kakao.maps.LatLng(filteredPost?.x, filteredPost?.y),
        level: 2,
      };
      const map = new kakao.maps.Map(container, options);
      // Map 객체에 대한 참조 저장
      setKakaoMap(map);

      // 마커가 표시될 위치입니다
      let markerPosition = new kakao.maps.LatLng(
        filteredPost?.x,
        filteredPost?.y
      );

      // 마커를 생성합니다
      let marker = new kakao.maps.Marker({
        position: markerPosition,
      });

      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map);
      map.setZoomable(false);

      let iwContent = `
        <div style="padding:5px;">
            ${filteredPost?.selectPlace} 
            <br>
            <a href=${filteredPost?.placeUrl} style="color:#D75B22" target="_blank">
              사이트 보기
            </a>
          </div>`,
        iwPosition = new kakao.maps.LatLng(33.450701, 126.570667); //인포윈도우 표시 위치입니다

      // 인포윈도우를 생성합니다
      let infowindow = new kakao.maps.InfoWindow({
        position: iwPosition,
        content: iwContent,
      });

      // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
      infowindow.open(map, marker);
    }
  };

  const onClickConfirmModal = () => {
    setConfirmModal(true);
  };

  const joinCounter = () => {
    setJoinCount((prevCount) => {
      const newCount = prevCount + 1;
      localStorage.setItem('joinCount', newCount.toString()); // 로컬스토리지에 저장
      return newCount;
    });
  };

  // joinCount 상태가 변경될 때마다 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem('joinCount', joinCount.toString());
  }, [joinCount]);

  const storedUserInfo = sessionStorage.getItem('userInfo');
  const userId: UserInfo = storedUserInfo
    ? JSON.parse(storedUserInfo).userId
    : {};

  useEffect(() => {
    addJoin();
  }, [joinCount]);

  const url = import.meta.env.VITE_API_URL;
  const addJoin = async () => {
    try {
      await axios.put(`${url}/api/join`, {
        postId: filteredPost?.postId,
        joinCount: joinCount,
        joinUser: [userId],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const joindedUserWarning = () => {
    const includeUser = filteredPost?.joinUser.some(
      (joinUser) => joinUser === userId
    );
    setJoinModal(includeUser);

    if (includeUser) {
      setModal(false);
      setConfirmModal(false);
    }
  };

  const JoinModalInfo: ModalInfo = {
    userName: '돼지력만랩',
    content: '님과 같이 먹을래요?',
    payment: 22000,
    balance: 11000,
    rbtntext: '참가하기',
    lbtntext: '취소',
    lonclick: () => {
      setModal(false);
    },
    ronclick: () => {
      setModal(false);
      onClickConfirmModal();
    },
  };

  const ConfirmModalInfo: ModalInfo = {
    content: '참가 및 결제가 완료되었습니다.',
    rbtntext: '확인',
    ronclick: () => {
      setConfirmModal(false);
      joinCounter();
    },
  };

  const aleadyJoinModalInfo: ModalInfo = {
    content: '이미 참가가 완료되었습니다.',
    rbtntext: '확인',
    ronclick: () => {
      setJoinModal(false);
    },
  };

  return (
    <>
      {joinModal ? <Modals info={aleadyJoinModalInfo} /> : null}
      {modal ? <Modals info={JoinModalInfo} /> : null}
      {confirmModal ? <Modals info={ConfirmModalInfo} /> : null}
      {confirmModal ? <Modals info={ConfirmModalInfo} /> : null}
      <section className="relative flex max-w-3xl h-full mx-auto">
        <div className="flex flex-col justify-between relative w-full">
          <div className="relative">
            <div className="absolute top-0 left-0 flex space-x-4 p-4 z-30">
              <IoIosArrowBack
                onClick={() => {
                  navigate('/');
                }}
                className="cursor-pointer text-black"
                size={35}
              />
              <IoHomeOutline
                onClick={() => {
                  navigate('/');
                }}
                className="cursor-pointer text-black"
                size={35}
              />
            </div>
            <div
              id="map"
              style={{
                width: '100%',
                height: '250px',
              }}
            ></div>
          </div>
          <div className="px-2.5 detail_calc pb-[83px]">
            <div className="flex gap-1.5 pt-3">
              <span className="bg-[#E6A88B] rounded-3xl px-2 py-1 text-white text-[13px]">
                <span className="text-[#D75B22] font-semibold">19시</span> 마감
              </span>
              <span className="bg-[#E6A88B] rounded-3xl px-2 py-1 text-white text-[13px]">
                {filteredPost?.selectedPayment}
              </span>
              <span
                className={`${
                  joinCount >= (filteredPost?.joinedPeople ?? 0)
                    ? `bg-[#ccc]`
                    : `bg-[#63B412]`
                } rounded-3xl px-2 py-1 text-white text-[13px]`}
              >
                {joinCount >= (filteredPost?.joinedPeople ?? 0)
                  ? '모집완료'
                  : '모집중'}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-[#ededed]">
              <div className="flex items-center gap-2">
                <img className="w-10 h-10" src="/img/profile-image.png" />
                <div>
                  <h1 className="font-semibold">{filteredPost?.author}</h1>
                  <div>
                    <span className="text-sm text-[#666] mr-1">
                      {filteredPost?.gender}
                    </span>
                    <span className="text-sm text-[#666]">
                      {filteredPost?.age}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <img src="/fire_icon.png" alt="화력 아이콘" />
                  <span className="text-sm">36.5</span>
                  <span className="text-sm">같밥 화력</span>
                </div>
                <div>
                  <div className="w-[118px] h-2 bg-[#F3F3F3] rounded-3xl truncate">
                    <div className="w-1/3 h-full bg-[#D75B22] rounded-3xl"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-3 border-b border-[#ededed]">
              <h2 className="text-lg font-semibold mb-2.5">
                {filteredPost?.title}
              </h2>
              <p>{filteredPost?.description}</p>
            </div>
            <div className="mt-3">
              <h2 className="font-semibold text-[#666] mb-1">성향 키워드</h2>
              <div className="leading-8">
                {preferenceArr.map((preferList, i) => (
                  <span
                    key={i}
                    className="border border-[#D75B22] rounded-3xl text-[#D75B22] bg-[#FFEFE8] px-2 py-0.5 mr-2 text-nowrap"
                  >
                    # {preferList}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3 pb-3 border-b border-[#ededed]">
              <h2 className="font-semibold text-[#666] mb-1">선호 키워드</h2>
              <div className="leading-8">
                {likeArr.map((like, i) => (
                  <span
                    key={i}
                    className="border border-[#3F7E01] rounded-3xl text-[#63B412] bg-[#F6FFEC] px-2 py-0.5 mr-2 text-nowrap"
                  >
                    # {like}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <h2 className="font-semibold text-[#666] mb-1">위치 정보</h2>
              <div>
                <p className="mb-1 text-sm text-[#ccc]">
                  {filteredPost?.categoryName}
                </p>
                <h2 className="text font-semibold mb-1 text-lg">
                  {filteredPost?.selectPlace}
                </h2>
                <div className="flex">
                  <img
                    className="w-5 h-5 mt-0.5 mr-1"
                    src="/img/location_icon.png"
                    alt="위치 정보 아이콘"
                  />
                  <div className="mb-3">
                    <p>{filteredPost?.placeName}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 border-t border-[#ededed]">
              <h2 className="mt-3 font-semibold text-[#666] mb-1">
                현재 참가자
              </h2>
              <div>
                <span>돼지력만랩</span>
                <span>돼지력만랩</span>
                <span>돼지력만랩</span>
              </div>
            </div>
            <div className="mt-3 border-t border-[#ededed]">
              <button className="mt-3 mb-1 py-1 px-2.5 font-semibold text-[#666] border border-[#666] rounded-3xl">
                영수증 미리보기
              </button>
            </div>
          </div>
          <nav className="fixed bottom-0 flex w-full max-w-3xl h-16 border-t bg-white z-20">
            <button
              onClick={() => {
                setModal((close) => !close);
                joindedUserWarning();
              }}
              className={`w-full h-full text-base font-semibold text-white cursor-pointer ${
                joinCount >= (filteredPost?.joinedPeople ?? 0)
                  ? 'bg-[#ccc] cursor-not-allowed'
                  : 'bg-[#D75B22]'
              }`}
              disabled={joinCount >= (filteredPost?.joinedPeople ?? 0)}
            >
              {joinCount >= (filteredPost?.joinedPeople ?? 0)
                ? '모집완료'
                : '참가하기'}
              <span className="ml-2.5">
                {joinCount} / {filteredPost?.joinedPeople}
              </span>
            </button>
          </nav>
        </div>
      </section>
    </>
  );
};
