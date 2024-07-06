import React from 'react';

interface Item {
   id: number;
   imageUrl: string;
   title: string;
   description: string;
}

const MainList: React.FC = () => {
   const items: Item[] = [
      {
         id: 1,
         imageUrl: 'https://via.placeholder.com/40',
         title: '마라탕 같이 먹어요',
         description: '만나서 결제 성수 2가 모집중 1',
      },
      // 추가 항목들을 여기에 추가할 수 있습니다.
   ];

   return (
      <div className="bg-[#F5F5F5] border border-[#DEDEDE] rounded-[13px] p-5  mb-3.5 h-[120px]">
         {items.map((item) => (
            <div key={item.id} className="flex py-4 first:pt-0 last:pb-0">
               <div className="ml-3 overflow-hidden">
                  <p className="text-[16px] font-medium text-slate-900 leading-tight">{item.title}</p>
                  <div className="flex space-x-2 mt-2">
                     <span className="inline-flex items-center rounded-[10px] bg-[#D75B22] bg-opacity-50 px-2 py-1 text-xs font-medium text-white">
                        만나서 결제
                     </span>
                     <span className="inline-flex items-center rounded-[10px] bg-[#D75B22] bg-opacity-50 px-2 py-1 text-xs font-medium text-white">
                        성수2가
                     </span>
                     <span className="inline-flex items-center rounded-[10px] bg-[#63B412] px-2 py-1 text-xs font-medium text-white">
                        모집중
                     </span>
                  </div>
                  <div className="flex space-x-2 mt-2">
                     <span className="flex items-center">
                        <img src="ino_time.png" alt="" className="mr-1" />1h
                     </span>
                     <span className="flex items-center">
                        <img src="ino_people-sharp.png" alt="" className="mr-1" />3/5
                     </span>
                  </div>
               </div>
               <img className="h-[80px] w-[80px] rounded-[9px] ml-auto" src={item.imageUrl} alt="" />
            </div>
         ))}
      </div>
   );
}

export default MainList;