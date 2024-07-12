import {FC, useState, useEffect} from 'react'

interface BillsInfo{
  name: string;
  price: string;
  quantity: number;
  total: string;
}

interface BillsList{
  bills: BillsInfo;
}

export interface BillsData{
  billsList: BillsList[];
  allTotal: string;
  balance: string;
}

interface BillsProps{
  joinedPeople: number;
  onUpdateBills: (bills: BillsData) => void;
}

export const Bills:FC<BillsProps> = ({joinedPeople, onUpdateBills})=>{
  const [billsList, setBillsList] = useState<BillsList[]>([]);
  // input
  const [menuName, setMenuName] = useState<string>('');
  const [menuPrice, setMenuPrice] = useState<string>('');
  const [menuQuantity, setMenuQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<string>('');
  const [bills, setBills] = useState<BillsInfo>({name: '', price: '', quantity: 0, total: ''})
  const [allTotal, setAllTotal] = useState<string>('0');
  const [balance, setBalance] = useState<string>('0');
  const [priceChk, setPriceChk] = useState<boolean>(false);

  // 글쓰기 영수증인지 확인 / 게시글 영수증 : false
  const [isWrite, setIsWrite] = useState<boolean>(true);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>)=>{
    // test: 정규식 검사 true or false
    const {name, value} = e.target;
    if(name === 'menu'){
      setMenuName(value);
    }else if(name === 'price'){
      if(value === '' || /^[0-9]*$/.test(value)){ 
        setMenuPrice(value);
        setPriceChk(false);
      }else{
        setPriceChk(true);
      }
    }else if(name === 'quantity'){
      setMenuQuantity(Number(value));
    }
  }

  const deleteComma = (num:string)=>{
    // , 제거
    const str = num.replace(/,/g, '');
    setMenuPrice(str);
  }

  // onChangeHandler에서 값이 바뀔 때마다 해당 메뉴의 총 액을 계산
  // 비동기로 처리하면 값의 변동이 한박자씩 느리므로 useEffect로 처리
  useEffect(()=>{
    deleteComma(menuPrice)
    const mp = Number(menuPrice).toLocaleString();
    
    // setMenuPrice(mp);
    const total = (Number(menuPrice) * menuQuantity).toLocaleString();
    setTotalPrice(String(total));

    const newBill:BillsInfo = {
      name: menuName,
      price: mp,
      quantity: menuQuantity,
      total: total
    }
    setBills({...bills, ...newBill});
    // console.log(bills);
  }, [menuName, menuPrice, menuQuantity])

  // 전체적인 총액 계산
  useEffect(()=>{
    let total = 0;
    billsList.map((bill)=>{
      total += bill.bills.quantity * Number(bill.bills.price.replace(/,/g, '')); // , 제거
    })
    let balance = (total / joinedPeople).toFixed(0);
    balance = Number(balance).toLocaleString()
    setBalance(balance);
    setAllTotal(total.toLocaleString());

    const data:BillsData = {
      billsList: billsList,
      allTotal: allTotal,
      balance: balance
    }
    onUpdateBills(data);
    // console.log(data);
  },[billsList, allTotal, balance]);

  // 메뉴 추가
  const addBillsList = ()=>{
    const newBillsList:BillsList = {
      bills: bills
    }
    if(menuName.trim() === '' || menuPrice.trim() === '' || menuQuantity === 0){
      alert('값을 올바르게 입력했는지 확인해주세요.');
    }else if(!/^[0-9]*$/.test(menuPrice)){
      alert('가격은 숫자만 입력해주세요.');
    }else{
      setBillsList([...billsList, newBillsList]);
      setMenuName('');
      setMenuPrice('');
      setMenuQuantity(0);
    }
  }

  return (
    <div className="mb-14 w-full flex-col items-center  max-w-xl">
      <div className='px-4 w-full'>
          <h2 className='text-xl font-bold'>모바일 영수증</h2>
          {isWrite &&
            <p className='border-b border-black pb-4'>정확한 가격을 기재해주세요.</p>
          }
          {!isWrite &&
          <>
            <p className='border-b border-black pb-4'>장소</p>
            <p className='border-b border-black pb-4'>주소</p>
            {/* 모집인원 수 */}
          </>
          }
      </div>
      <div className='mb-2 mt-3 px-4'>
          <div className='flex justify-between font-bold mt-3'>
            <p className='w-[25%] text-start'>상품명</p>
            <p className='w-[25%] text-center'>가격</p>
            <p className='w-[25%] text-center'>수량</p>
            <p className='w-[25%] text-end'>총액</p>
          </div>
          <ul className='border-b border-black pb-3'>
            {billsList&&
            billsList.map((bill, index)=>(
              <li className='flex justify-between mt-3 text-sm' key={index}>
                <p className='w-[25%] text-start'>{bill.bills.name}</p>
                <p className='w-[25%] text-center'><span>{bill.bills.price}</span>원</p>
                <p className='w-[25%] text-center'>{bill.bills.quantity}</p>
                <p className='w-[25%] text-end'>{bill.bills.total}원</p>
              </li>
              ))
            }
          </ul>
      </div>
      <div className='border-b border-black mx-4 pb-3'>
        <div className='flex justify-between'>
            <h3 className='font-[600] text-lg'>총 합계</h3>
            <p className='text-end'>{allTotal}원</p>
        </div>
        <div className='flex justify-between'>
            <h3 className='font-[600] text-lg'>결제 금액</h3>
            <p className='text-end text-red-500 font-bold'>{balance}원</p>
        </div>
      </div>
      <div>
          <h3 className='px-4 mt-3 text-end font-bold text-xl'>메뉴 추가</h3>
          <div className='w-full flex justify-between items-center mt-4 shrink-0 px-1 text-sm'>
            <input className='mr-[4%] h-10 w-[40%] px-1 rounded-xl bg-gray-100 text-center'
            value={menuName} name='menu' type="text" onChange={onChangeHandler} onKeyDown={(e) => e.key === 'Enter' && addBillsList()} placeholder='메뉴' />
            <span className='w-[44%] relative'>
              <div className='w-[90%] flex items-center'>
                <input className='h-10 w-full px-1 rounded-xl bg-gray-100 text-center'
                min={0} step={100} onChange={onChangeHandler}
                value={menuPrice} name='price' type="text" onKeyDown={(e) => e.key === 'Enter' && addBillsList()} placeholder='가격' />
                <label className='ml-1 text-sm'>원</label>
              </div>
              <p className='text-red-500 text-xs absolute'>{priceChk&& '*숫자만 입력하세요'}</p>
            </span>
            <span className='w-[24%] relative'>
              <div className='w-[90%] flex items-center'>
                <input className='h-10 w-full px-1 rounded-xl bg-gray-100 text-center'
                min={1} onChange={onChangeHandler}
                value={menuQuantity} name='quantity' type="number" onKeyDown={(e) => e.key === 'Enter' && addBillsList()} placeholder='수량' />
                <label className='ml-1 text-sm'>개</label>
              </div>
            </span>
          </div>
      </div>
      <div className='flex flex-col items-end mr-3 mt-2'>
        <span className='text-xl'>
          <input className='h-10 px-1 rounded-xl bg-white text-end'
          type="text" min={0} disabled 
          value={totalPrice+' 원'}
          />
        </span>
        <button type='submit' onClick={addBillsList} className='block rounded-[40px] whitespace-nowrap bg-customOrange text-white w-[60px] h-[32px]'>추가</button>
      </div>
    </div>
  )
}
