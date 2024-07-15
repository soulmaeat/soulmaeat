import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import TabBar from '../components/TabBar';
import { ModalInfo, Modals } from '../components/Modals';
import axios from 'axios';
import { UserData } from '../App';
import { useSoulpay } from '../contexts/SoulpayContext'; // Context 사용 추가

interface ChargeProps {
  userData: UserData | null;
}

const Charge: React.FC<ChargeProps> = ({ userData }) => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number>(5000); // 충전할 금액
  const [privacyAgreement, setPrivacyAgreement] = useState<boolean>(false); // 개인정보 수집 동의 여부
  const [purchaseAgreement, setPurchaseAgreement] = useState<boolean>(false); // 구매 조건 동의 여부
  const [modal, setModal] = useState<boolean>(false);
  const [currentSoulpay, setCurrentSoulpay] = useState<number>(0); // 현재 로컬 스토리지의 소울페이 잔액
  const { setSoulpay } = useSoulpay(); // Context에서 소울페이 업데이트 함수 가져오기

  useEffect(() => {
    // 페이지 로드 시 유저 데이터에서 소울페이 값 로드
    if (userData?.user?.soulpay) {
      setSoulpay(userData.user.soulpay);
      setCurrentSoulpay(userData.user.soulpay); // 현재 소울페이 값으로 설정
    }

    // 로컬 스토리지에서 저장된 현재 소울페이 값 로드
    const storedSoulpay = parseFloat(localStorage.getItem('soulpay') || '0');
    setCurrentSoulpay(storedSoulpay);
  }, [userData]);

  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount);
  };

  const handleCharge = async () => {
    if (!privacyAgreement || !purchaseAgreement) {
      // 모달 표시
      setModal(true);
      return;
    }
  
    try {
      const storedUserInfo = sessionStorage.getItem('userInfo');
      const token = storedUserInfo ? JSON.parse(storedUserInfo).token : '';
  
      if (!token) {
        console.error('세션 스토리지에서 토큰을 찾을 수 없습니다.');
        return;
      }

      const updatedSoulpay = currentSoulpay + selectedAmount;
  
      // 서버에 충전 요청 보내기
      const response = await axios.put(
        'http://localhost:3000/api/charge',
        { userId: userData?.user?.userId, soulpay: updatedSoulpay },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 충전 성공 시 처리
      console.log(response.data.message);

      localStorage.setItem('soulpay', updatedSoulpay.toString());
  
      // 로컬 스토리지에 선택한 충전 금액 저장
      localStorage.setItem('selectedAmount', selectedAmount.toString());

      setCurrentSoulpay(updatedSoulpay); // 현재 소울페이 잔액 업데이트
  
      // 페이지 이동
      navigate('/chargeconfirm');
    }  catch (error) {
      console.error('충전오류:', error);
      alert('충전 과정에서 오류가 발생했습니다.');
    }
  };

  const ConfirmModalInfo: ModalInfo = {
    content: '개인정보 수집 및 이용동의와 구매조건 확인에 동의해야 충전이 가능합니다.',
    rbtntext: '확인',
    ronclick: () => {
      setModal(false); // 모달 닫기
    },
  };

  const togglePrivacyAgreement = () => {
    setPrivacyAgreement(!privacyAgreement);
  };

  const togglePurchaseAgreement = () => {
    setPurchaseAgreement(!purchaseAgreement);
  };

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  const isChargeButtonEnabled = privacyAgreement && purchaseAgreement;

  return (
    <>
      {modal && <Modals info={ConfirmModalInfo} />}
      <section className="max-w-3xl mx-auto p-5 min-h-screen relative">
        <div className="flex items-center mb-4">
          <IoIosArrowBack size={35} onClick={handleGoBack} />
          <h1 className="mx-2">충전하기</h1>
        </div>

        <div className="mt-8 mb-4">
          <h2 className="font-semibold mb-2">금액 선택</h2>
          <ul className="grid grid-cols-2 gap-5 text-center font-semibold">
            {[5000, 10000, 20000, 30000, 50000, 100000].map(amount => (
              <li
                key={amount}
                className={`border p-2 rounded-md cursor-pointer ${selectedAmount === amount ? 'border-customOrange text-customOrange' : 'border-gray-300'}`}
                onClick={() => handleAmountSelection(amount)}
              >
                {amount.toLocaleString()}원
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-20 left-0 right-0 p-5">
          <label className="flex justify-between items-center text-gray-500 mb-4" htmlFor="privacyAgreement">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={privacyAgreement}
                onChange={togglePrivacyAgreement}
                className="hidden"
                id="privacyAgreement"
              />
              <div
                className={`w-5 h-5 border-2 rounded-full cursor-pointer ${privacyAgreement ? 'border-customOrange bg-customOrange' : 'border-gray-300 bg-white'}`}
              ></div>
              <p className="text-sm ml-2">개인정보 수집 및 이용동의</p>
            </div>
            <span
              className="ml-auto cursor-pointer text-xs border rounded-full px-2 py-1"
              onClick={() => navigate('#')}
            >
              상세내용보기
            </span>
          </label>

          <label className="flex items-center mb-4" htmlFor="purchaseAgreement">
            <input
              type="checkbox"
              checked={purchaseAgreement}
              onChange={togglePurchaseAgreement}
              className="hidden"
              id="purchaseAgreement"
            />
            <div
              className={`w-5 h-5 border-2 rounded-full cursor-pointer ${purchaseAgreement ? 'border-customOrange bg-customOrange' : 'border-gray-300 bg-white'}`}
            ></div>
            <p className="text-gray-500 text-sm ml-2">
              구매조건을 확인하였으면 결제 진행에 동의합니다.
            </p>
          </label>

          <div className="mb-4">
            <h2 className="hidden">결제 수단 선택</h2>
            <div className="grid grid-cols-1 gap-5 text-center font-semibold">
              <button
                className={`px-4 py-2 rounded-md cursor-pointer ${isChargeButtonEnabled ? 'bg-customOrange text-white' : 'border border-customOrange text-customOrange'}`}
                onClick={handleCharge}
                disabled={!isChargeButtonEnabled}
              >
                충전하기
              </button>
            </div>
          </div>
        </div>

        <TabBar />
      </section>
    </>
  );
}

export default Charge;
