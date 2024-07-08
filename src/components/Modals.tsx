type ModalInfo = {
  payment?: number;
  balance?: number;
  userName?: string;
  content?: string;
  btntext?: string;
  lonclick?: (e?: any) => void;
  ronclick?: (e?: any) => void;
};

interface ModalProps {
  info: ModalInfo;
}

export const Modals = ({ info }: ModalProps) => {
  const { payment, balance, userName, content, btntext, lonclick, ronclick } =
    info;

  return (
    <>
      <div className="fixed w-full h-full bg-black/50 z-10"></div>
      <div className="fixed top-1/2 left-1/2 bg-white -translate-x-2/4 -translate-y-2/4 modal_wcalc h-48 rounded-lg z-10">
        <div className="relative flex w-full h-full">
          <div className="flex flex-col justify-center w-full modal_hcalc p-2.5">
            <h2 className="font-semibold text-center break-keep">
              <strong className="text-customOrange">
                {userName && userName}
              </strong>
              {content}
            </h2>
            <div className="self-end pt-2.5 text-sm">
              <p>
                {payment && `미리 결제 금액: ${payment.toLocaleString()}원`}
              </p>
              <p>
                {balance && `* 잔여 결제 금액: ${balance.toLocaleString()}원`}
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 flex w-full gap-2.5 p-2.5">
            <button
              onClick={() => lonclick?.()}
              className="w-full h-12 border border-[#eaeaea] rounded-lg"
            >
              취소
            </button>
            <button
              onClick={() => ronclick?.()}
              className="w-full h-12 rounded-lg text-white bg-customOrange"
            >
              {btntext}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export type { ModalInfo };
