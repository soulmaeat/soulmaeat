import React, { useState, useEffect } from 'react';

interface PreferTabProps {
  title: string;
  onSelect: (title: string, isActive: boolean) => void;
}
//onSelect 콜백을 추가하여 isActive 상태가 변경될 때 이를 부모 컴포넌트에 알립니다.

const PreferTab: React.FC<PreferTabProps> = ({ title, onSelect }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    onSelect(title, isActive);
  }, [isActive]);

  return (
    <div
      className={`inline-block items-center text-[20px] px-2 py-0.5 rounded-[12px] mb-[20px] mr-4 font-bold cursor-pointer transition-all duration-300 
                  ${isActive ? 'bg-[#FFEFE8] text-[#D75B22] border-[#D75B22]' : 'border-[#888888] text-[#888888]'}`}
      style={{ borderWidth: '1px' }}
      onClick={handleClick}
    >
      {title}
    </div>
  );
};

export default PreferTab;
