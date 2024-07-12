import {FC, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import { IoIosArrowBack } from "react-icons/io";

interface NavBarProps{
  title: string;
}

export const NavBar:FC<NavBarProps> = ({title})=>{
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 경로가 변경될 때마다 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex justify-between items-center mb-[22px] w-full p-4">
      <span className='flex items-center'>
        <IoIosArrowBack onClick={()=>{navigate(-1)}} className='cursor-pointer' size={35} />
        <h1 className="mx-2">{title}</h1>
      </span>
        <IoHomeOutline className='cursor-pointer' size={32} onClick={()=>navigate('/main')} />
    </div>
  )
}
