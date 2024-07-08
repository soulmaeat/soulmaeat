import React, {useState} from 'react'

const PreferTab: React.FC<{ title: string }>=({ title }) =>{
   const [isActive, setIsActive] = useState(false);
   const handleClick = () => {
      setIsActive(!isActive); // 클릭 시 isActive 값을 토글합니다.
    };

  return (
   <div
      className={`inline-block items-center text-[20px] px-2 py-0.5 rounded-[12px] mb-[20px] mr-4 font-bold cursor-pointer 
                  ${isActive ? 'bg-[#FFEFE8] text-[#D75B22] border-[#D75B22]' : 'border-[#888888] text-[#888888]'}`}
      style={{ borderWidth: '1px' }} // 테두리 너비를 명시적으로 지정합니다.
      onClick={handleClick}
    >
      {title}
    </div>
  )
}
export default PreferTab;