import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MainList from '../components/MainList';
import { IoIosArrowDown } from 'react-icons/io';
import { BiPencil } from 'react-icons/bi';
import TabBar from '../components/TabBar';
import axios from 'axios';

interface MainProps {
  addrInfo: {
    roadAddr: string;
    numberAddr: string;
  };
}

export interface PostData {
  title?: string;
  addressName?: string;
  age?: string;
  author?: string;
  categoryName?: string;
  createAt?: Date;
  description?: string;
  gender?: string;
  joinedPeople?: number;
  phone?: string | undefined;
  placeName?: string;
  placeUrl?: string;
  postId?: string;
  roadAddressName?: string;
  selectPlace?: string;
  selectedKeyword?: { likeList: string[]; _id: string }[];
  selectedPayment?: string;
  x?: string;
  y?: string;
  _id?: string;
}

const MainPage: React.FC<MainProps> = ({ addrInfo }) => {
  const [currentAddr, setCurrentAddr] = useState(addrInfo);
  const [postData, setPostData] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  console.log(postData);

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    topScroll();
  }, [currentAddr, location]);

  const url = import.meta.env.VITE_API_URL;
  const getPosts = async () => {
    try {
      const res = await axios.get(`${url}/api/posts`);
      const result = res.data;
      console.log(result);
      setPostData(result.posts);
    } catch (err) {
      console.error(err);
    }
  };

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
        {postData.length !== 0 &&
          postData.map((post) => <MainList key={post._id} post={post} />)}
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
