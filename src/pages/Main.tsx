import React,{useState} from 'react';
import MainList from '../components/MainList';
import { IoIosArrowDown } from "react-icons/io";
import { BiPencil } from "react-icons/bi";
import TabBar from '../components/TabBar';

interface MainProps {
  addrInfo: {
    roadAddr: string;
    numberAddr: string;
  };
}

const Main: React.FC<MainProps> = ({addrInfo}) => {
  const [currentAddr, setCurrentAddr] = useState(addrInfo.roadAddr);

  return (
    <section className="max-w-3xl mx-auto p-5">
      <div className='flex items-center text-[20px] mb-[12px]'><IoIosArrowDown className='mr-[8px]'/>
       {currentAddr&&
       currentAddr.split(' ').slice(0, 3).join(' ')}
       {!currentAddr&&'서울특별시 중구'}
       </div>
      <div className="w-[74px] h-[27px] mb-[22px] border border-[#DEDEDE] rounded-[16px] flex items-center justify-center">
        모집중 <IoIosArrowDown />
      </div>
      <div className="space-y-[14px] mb-[80px]">
        <MainList />
        <MainList />
        <MainList />
        <MainList />
        <MainList />
        <MainList />
        <MainList />
      </div>
      <span className="fixed bottom-[120px] right-5 w-[50px] h-[50px] bg-[#D75B22] text-white flex items-center justify-center rounded-[50%]">
        <BiPencil className='w-6 h-6'/>
      </span>
      <TabBar/>
    </section>
  );
};

export default Main;
