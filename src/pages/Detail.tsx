export const Detail = () => {
  const tendencyArr: string[] = [
    '많이 먹어요',
    '조용한 분위기를 좋아해요',
    '편식해요',
  ];
  const likeArr: string[] = [
    '동성 친구만',
    '여러개 주문해서 나눠먹기',
    '음주 X',
  ];

  return (
    <>
      <section>
        <img className="w-full max-h-72" src="/fake_img.png" />
        <div className="max-w-3xl mx-auto px-2.5">
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
            {/* <div className="flex items-center gap-1.5 mt-3">
            <img className="w-5 h-5" src="/img/people_icon.png" alt="" />
            <span>
              <span className="text-[#D75B22] font-semibold">4</span> / 5
            </span>
          </div> */}
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
            <div></div>
          </div>
        </div>
      </section>
      <nav className="fixed left-0 bottom-0 flex w-full h-16 border-t ">
        <div className="flex w-1/4 items-center justify-center">
          <img
            className="w-8 h-7 cursor-pointer"
            src="/img/zzim_icon.png"
            alt="찜하기"
          />
        </div>
        <button className="bg-[#D75B22] w-full h-full text-base font-semibold text-white cursor-pointer">
          참가하기
        </button>
      </nav>
    </>
  );
};
