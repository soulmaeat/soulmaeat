import React, { useState, useEffect } from 'react';

interface PreferKeywordProps {
  title: string;
  onSelect: (title: string, isActive: boolean) => void;
}

const PreferKeyword: React.FC<PreferKeywordProps> = ({ title, onSelect }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    onSelect(title, isActive);
  }, [isActive]);

  return (
    <div
      className={`inline-block items-center text-[16px] px-2 py-0.5 rounded-[12px] mr-2 font-bold cursor-pointer transition-all duration-300 
                  ${isActive ? 'bg-[#F7FFF0] text-[#63B412] border-[#63B412]' : 'border-[#888888] text-[#888888]'}`}
      style={{ borderWidth: '1px', transition: 'all 0.3s ease' }} // transition 스타일 추가
      onClick={handleClick}
    >
      {title}
    </div>
  );
};

export default PreferKeyword;
