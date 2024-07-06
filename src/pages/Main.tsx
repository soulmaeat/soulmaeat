import React from 'react';
import MainList from '../components/MainList';
import { IoIosArrowDown } from "react-icons/io";

import TabBar from '../components/TabBar';

const Main: React.FC = () => {
  return (
    <section className="max-w-3xl mx-auto p-5">
      <div className='flex'><IoIosArrowDown /> 장충단로</div>
      <div className="w-[74px] h-[27px] mb-[22px] border border-[#DEDEDE] rounded-[16px] flex items-center justify-center">
        모집중 <IoIosArrowDown />
      </div>
      <div className="space-y-[14px]">
        <MainList />
        <MainList />
        <MainList />
        <MainList />
        <MainList />
        <MainList />
        <MainList />
      </div>
      <TabBar/>
    </section>
  );
};

export default Main;
