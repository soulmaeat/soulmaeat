import '../App.css';
import { useEffect, useState } from 'react';
import { kakao } from '../App';
import { ModalInfo } from '../components/Modals';
// components
import { Modals } from '../components/Modals';

export const Detail = () => {
  const tendencyArr = ['많이 먹어요', '조용한 분위기를 좋아해요', '편식해요'];
  const likeArr = ['동성 친구만', '여러개 주문해서 나눠먹기', '음주 X'];

  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const [modal, setModal] = useState<boolean>(false);

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

  const JoinModalInfo: ModalInfo = {
    userName: '돼지력만랩',
    content: '님과 같이 먹을래요?',
    payment: 22000,
    balance: 11000,
    btntext: '참가하기',
    lonclick: () => {
      setModal((close) => !close);
    },
    ronclick: () => {
      setModal((close) => !close);
    },
  };

  return (
    <>
      {modal ? <Modals info={JoinModalInfo} /> : null}
      <section className="relative flex w-full h-full">
        <div>
          <img className="w-full max-h-72" src="/fake_img.png" />
          <div className="max-w-3xl mx-auto px-2.5 detail_calc">
            <div className="flex gap-1.5 pt-3">
              <span className="bg-[#E6A88B] rounded-3xl px-2 py-1 text-white text-[13px]">
                <span className="text-[#D75B22] font-semibold">19시</span> 마감
              </span>
              <span className="bg-[#E6A88B] rounded-3xl px-2 py-1 text-white text-[13px]">
                미리 결제
              </span>
              <span className="bg-[#63B412] rounded-3xl px-2 py-1 text-white text-[13px]">
                모집중
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
                  <div>
                    <p>서울 종로구 종로54길 17-10 1층</p>
                    <p>동묘앞역 6번 출구에서 188m</p>
                  </div>
                </div>
                <div id="map" style={{ width: '100%', height: '400px' }}></div>
              </div>
            </div>
          </div>
        </div>
        <nav className="fixed bottom-0 flex w-full h-16 border-t bg-white">
          <div className="flex w-1/4 items-center justify-center">
            <img
              className="w-8 h-7 cursor-pointer"
              src="/img/zzim_icon.png"
              alt="찜하기"
            />
          </div>
          <button
            onClick={() => setModal((close) => !close)}
            className="bg-[#D75B22] w-full h-full text-base font-semibold text-white cursor-pointer"
          >
            참가하기
            <span className="ml-2.5">1 / 3</span>
          </button>
        </nav>
      </section>
    </>
  );
};
