import '../App.css';
import { useEffect, useState } from 'react';
import { kakao } from '../App';
import { ModalInfo } from '../components/Modals';
// components

import { useNavigate } from 'react-router-dom';
import { Modals } from '../components/Modals';
import { IoHomeOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

export const Detail = () => {
  const tendencyArr = ['많이 먹어요', '조용한 분위기를 좋아해요', '편식해요'];
  const likeArr = ['동성 친구만', '여러개 주문해서 나눠먹기', '음주 X'];

  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [joinCount, setJoinCount] = useState<number>(1);

  const navigate = useNavigate();

  useEffect(() => {
    loadKakaoMap();
  }, []);

  const loadKakaoMap = () => {
    if (kakao) {
      const container = document.getElementById('map');
      const options = {
        // 건대 입구역 기준
        center: new kakao.maps.LatLng(37.54022556554232, 127.0706397574826),
        level: 2,
      };
      const map = new kakao.maps.Map(container, options);
      // Map 객체에 대한 참조 저장
      setKakaoMap(map);

      // 마커가 표시될 위치입니다
      var markerPosition = new kakao.maps.LatLng(33.450701, 126.570667);

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        position: markerPosition,
      });

      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map);
    }
  };

  const onClickConfirmModal = () => {
    setConfirmModal(true);
  };

  const joinCounter = () => {
    setJoinCount(joinCount + 1);
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

  return (
    <>
      {modal ? <Modals info={JoinModalInfo} /> : null}
      {confirmModal ? <Modals info={ConfirmModalInfo} /> : null}
      <section className="relative flex max-w-3xl h-full mx-auto">
        <div className="flex flex-col justify-between relative w-full">
        <div className="relative">
      <div className="absolute top-0 left-0 flex space-x-4 p-4">
        <IoIosArrowBack 
          onClick={() => { navigate('/') }} 
          className="cursor-pointer text-white" 
          size={35} 
        />
        <IoHomeOutline 
          onClick={() => { navigate('/') }} 
          className="cursor-pointer text-white" 
          size={35} 
        />
      </div>
      <img className="w-full max-h-72" src="/fake_img.png" alt="fake" />
    </div>
          <div className="px-2.5 detail_calc pb-[83px]">
            <div className="flex gap-1.5 pt-3">
              <span className="bg-[#E6A88B] rounded-3xl px-2 py-1 text-white text-[13px]">
                <span className="text-[#D75B22] font-semibold">19시</span> 마감
              </span>
              <span className="bg-[#E6A88B] rounded-3xl px-2 py-1 text-white text-[13px]">
                미리 결제
              </span>
              <span
                className={`${joinCount >= 3 ? `bg-[#ccc]` : `bg-[#63B412]`
                  } rounded-3xl px-2 py-1 text-white text-[13px]`}
              >
                {joinCount >= 3 ? '모집완료' : '모집중'}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-[#ededed]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-300"></div>
                <div>
                  <h1 className="font-semibold">돼지력 만랩</h1>
                  <p className="text-sm text-[#666]">동대문구 을지로 6가</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <img src="/fire_icon.png" alt="" />
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
                피자 드실분 3분 선착순
              </h2>
              <p>피자 드시러 가실분 3분 모집합니다.</p>
            </div>
            <div className="mt-3">
              <h2 className="font-semibold text-[#666] mb-1">성향 키워드</h2>
              <div className="leading-8">
                {tendencyArr.map((tendency, i) => (
                  <span
                    key={i}
                    className="border border-[#D75B22] rounded-3xl text-[#D75B22] bg-[#FFEFE8] px-2 py-0.5 mr-2 text-nowrap"
                  >
                    # {tendency}
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
                <h2 className="text font-semibold mb-1 text-lg">
                  동묘 가라지 피자
                </h2>
                <div className="flex">
                  <img
                    className="w-5 h-5 mt-0.5 mr-1"
                    src="/img/location_icon.png"
                    alt="위치 정보 아이콘"
                  />
                  <div className="mb-3">
                    <p>서울 종로구 종로54길 17-10 1층</p>
                    <p>동묘앞역 6번 출구에서 188m</p>
                  </div>
                </div>
                <div
                  id="map"
                  style={{
                    width: '100%',
                    height: '250px',
                    borderRadius: '10px',
                  }}
                ></div>
              </div>
            </div>
          </div>
          <nav className="fixed bottom-0 flex w-full max-w-3xl h-16 border-t bg-white z-20">
            <div className="flex w-1/4 items-center justify-center">
              <img
                className="w-8 h-7 cursor-pointer"
                src="/img/zzim_icon.png"
                alt="찜하기"
              />
            </div>
            <button
              onClick={() => setModal((close) => !close)}
              className={`w-full h-full text-base font-semibold text-white cursor-pointer ${joinCount >= 3 ? 'bg-[#ccc] cursor-not-allowed' : 'bg-[#D75B22]'
                }`}
              disabled={joinCount >= 3}
            >
              {joinCount >= 3 ? '모집완료' : '참가하기'}
              <span className="ml-2.5">{joinCount} / 3</span>
            </button>
          </nav>
        </div>
      </section>
    </>
  );
};
