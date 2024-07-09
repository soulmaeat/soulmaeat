import { FC } from 'react';
interface BadgeProps {
  props: string;
}

export const Badge:FC<BadgeProps> = (BadgeProps)=>{
  const {props} = BadgeProps;
  return (
    <div className='px-1 py-1 bg-gray-100 border border-gray-300 rounded-xl text-center text-xs text-gray-500 inline-block'>
      {props}
    </div>
  )
}
