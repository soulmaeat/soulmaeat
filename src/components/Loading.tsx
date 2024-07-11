import React from 'react'
import { AiOutlineLoading } from "react-icons/ai";

export const Loading = ()=>{
  return (
    <div>
      <div className='z-10 size-full absolute flex justify-center bg-[#00000033]'>
            <div className='inline-block translate-y-[30%] translate-x-[50%]'>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 40 40" style={{width: '40px', height: '40px'}}>
                <AiOutlineLoading className='text-customOrange' size={40}/>
              </svg>
            </div>
          </div>
    </div>
  )
}
