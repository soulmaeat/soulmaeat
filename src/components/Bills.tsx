import React from 'react'

interface BillProps{
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export const Bills = ()=>{
  return (
    <div className="mb-20 w-full flex-col items-center  max-w-xl">
      <div className='px-4 w-full'>
          <h2 className='text-xl font-bold'>모바일 영수증</h2>
          <p className='border-b border-black pb-4'>정확한 가격을 기재해주세요.</p>
      </div>
      <div className='mb-2 mt-3 px-4'>
          {/* <p className='text-gray-400 text-center'>예) 로제파스타 | 12,000원 | 1개</p> */}
          <div className='flex justify-between font-bold mt-3'>
            <p>상품명</p>
            <p>가격</p>
            <p>수량</p>
            <p>총액</p>
          </div>
          <ul className='border-b border-black pb-3'>
            {
            <>
                <li className='flex justify-between mt-3'>
                  <p>로제파스타</p>
                  <p><span>12,000</span>원</p>
                  <p>2</p>
                  <p><span>24,000</span>원</p>
                </li>
                <li className='flex justify-between mt-3'>
                  <p>크림리조또</p>
                  <p><span>9,000</span>원</p>
                  <p>3</p>
                  <p><span>27,000</span>원</p>
                </li>
            </>
            }
          </ul>
      </div>
      <div className='px-4'>
          <h3 className='font-[600] text-lg text-end'>총 합계</h3>
          <p className='text-end'>51,000원</p>
      </div>
      <div className='px-4'>
          <h3 className='font-[600] text-lg text-end'>결제 금액</h3>
          <p className='text-end'>51,000원</p>
      </div>
      <div className='w-full flex justify-between items-center mt-4 shrink-0 px-4'>
          <input className='h-10 w-[30%] px-1 rounded-xl bg-gray-100 text-center'
          type="text" placeholder='메뉴' />
          <input className='h-10 w-[20%] px-1 rounded-xl bg-gray-100 text-center'
          type="number" placeholder='가격' />
          <input className='h-10 w-[14%] px-1 rounded-xl bg-gray-100 text-center'
          type="number" placeholder='수량' />
          
          <p className='inline-block'><span>총액</span>원</p>
          <button className='block rounded-[40px] whitespace-nowrap bg-customOrange text-white w-[43px] h-[32px]'>추가</button>
      </div>
    </div>
  )
}
