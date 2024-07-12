import React from 'react';
import { RiTimer2Fill } from 'react-icons/ri';
import { IoPeople } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { PostData } from '../App';

interface MainListProps {
  post: PostData;
}

const MainList: React.FC<MainListProps> = ({ post }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#F5F5F5] border border-[#DEDEDE] rounded-[13px] p-5 mb-3.5">
      <div
        key={post._id}
        className="flex py-4 first:pt-0 last:pb-0 cursor-pointer"
        onClick={() => navigate(`/detail/${post._id}`)}
      >
        <div className="ml-3 overflow-hidden">
          <p className="text-[16px] font-medium text-slate-900 leading-tight">
            {post.title}
          </p>
          <div className="flex space-x-2 mt-2">
            <span className="inline-flex items-center rounded-[10px] bg-[#D75B22] bg-opacity-50 px-2 py-1 text-xs font-medium text-white">
              {post.selectedPayment}
            </span>
            <span className="inline-flex items-center rounded-[10px] bg-[#D75B22] bg-opacity-50 px-2 py-1 text-xs font-medium text-white">
              {post.selectPlace}
            </span>
            <span className="inline-flex items-center rounded-[10px] bg-[#63B412] px-2 py-1 text-xs font-medium text-white">
              모집중
            </span>
          </div>
          <div className="flex space-x-2 mt-2">
            <span className="flex items-center mr-[12px]">
              <RiTimer2Fill color="#D75B22" className="mr-[4px]" />
              1h
            </span>
            <span className="flex items-center">
              <IoPeople color="#D75B22" className="mr-[4px]" />
              {post.joinedPeople}/{5}
            </span>
          </div>
        </div>
        <img
          className="h-[80px] w-[80px] rounded-[9px] ml-auto"
          src="https://via.placeholder.com/80"
          alt=""
        />
      </div>
    </div>
  );
};

export default MainList;
