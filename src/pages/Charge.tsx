import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import TabBar from '../components/TabBar';
import { ModalInfo, Modals } from '../components/Modals';

const Charge: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5000); // Default to 5000원
  const [privacyAgreement, setPrivacyAgreement] = useState<boolean>(false);
  const [purchaseAgreement, setPurchaseAgreement] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount);
  };

  const ConfirmModalInfo: ModalInfo = {
    content: '개인정보 수집 및 이용동의와 구매조건 확인에 동의해야 충전이 가능합니다.',
    rbtntext: '확인',
    ronclick: () => {
      setModal(false); // 모달 닫기
    },
  };

  const handleCharge = () => {
    if (!privacyAgreement || !purchaseAgreement) {
      setModal(true); // 모달 표시
      return;
    }
    navigate('/chargeconfirm', { state: { amount: selectedAmount } }); // 결제확인 페이지로 이동
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