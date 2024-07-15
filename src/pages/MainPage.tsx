import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MainList from '../components/MainList';
import { IoIosArrowDown } from 'react-icons/io';
import { BiPencil } from 'react-icons/bi';
import TabBar from '../components/TabBar';
import { PostData } from '../App';

interface MainProps {
  postData: PostData[];
  addrInfo: {
    roadAddr: string;
    numberAddr: string;
  };
}

interface SelectAddrInfo {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
}

const MainPage: React.FC<MainProps> = ({ addrInfo, postData }) => {
  const [currentAddr, setCurrentAddr] = useState(addrInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // 도와 구 추출
  const addressName = addrInfo?.numberAddr;
  const match = addressName?.match(/^(\S+ \S+)/);
  const seoulDistrict = match ? match[1] : '';

  // 현재 유저의 위치 주소의 도와 구가 포함된 포스트만 필터링
  const filteredAddress = postData.filter((post) =>
    post?.placeName?.includes(seoulDistrict)
  );

  useEffect(() => {
    topScroll();
  }, [currentAddr, location]);

  const topScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-3xl mx-auto p-5">
      <div className="flex items-center text-[20px] mb-[12px]">
        <IoIosArrowDown className="mr-[8px]" />
        {currentAddr.numberAddr &&
          currentAddr.roadAddr &&
          currentAddr.numberAddr.split(' ').slice(0, 3).join(' ')}
        {currentAddr.numberAddr &&
          !currentAddr.roadAddr &&
          currentAddr.numberAddr.split(' ').slice(0, 3).join(' ')}
        {!currentAddr.numberAddr &&
          currentAddr.roadAddr &&
          currentAddr.roadAddr.split(' ').slice(0, 3).join(' ')}
        {!currentAddr.numberAddr && !currentAddr.roadAddr && '서울특별시 중구'}
      </div>
      <div className="w-[74px] h-[27px] mb-[22px] border border-[#DEDEDE] rounded-[16px] flex items-center justify-center">
        모집중 <IoIosArrowDown />
      </div>
      <div className="space-y-[14px] mb-[80px]">
        {filteredAddress.length !== 0 ? (
          filteredAddress.map((post) => <MainList key={post._id} post={post} />)
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            해당 주소의 게시글이 존재하지 않습니다.
          </div>
        )}
      </div>
      <button className="fixed bottom-[120px] right-5 w-[50px] h-[50px] bg-[#D75B22] text-white flex items-center justify-center rounded-[50%] cursor-pointer ">
        <Link to="/write">
          <BiPencil className="w-6 h-6" />
        </Link>
      </button>
      <TabBar />
    </section>
  );
};

export default MainPage;
