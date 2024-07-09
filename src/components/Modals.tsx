type ModalInfo = {
  payment?: number;
  balance?: number;
  userName?: string;
  content?: string;
  rbtntext?: string;
  lbtntext?: string;
  lonclick?: (e?: any) => void;
  ronclick?: (e?: any) => void;
};

interface ModalProps {
  info: ModalInfo;
}

export const Modals = ({ info }: ModalProps) => {
  const {
    payment,
    balance,
    userName,
    content,
    rbtntext,
    lbtntext,
    lonclick,
    ronclick,
  } = info;

  return (
    <>
      <div className="fixed w-full h-full bg-black/50 z-30"></div>
      <div className="fixed top-1/2 left-1/2 bg-white -translate-x-2/4 -translate-y-2/4 w-80 h-48 rounded-lg z-30">
        <div className="relative flex w-full h-full">
          <div className="flex flex-col justify-center w-full modal_hcalc p-2.5">
            <h2 className="font-semibold text-center break-keep">
              <strong className="text-customOrange">
                {userName && userName}
              </strong>
              {content}
            </h2>
            <div className=" pt-2.5 text-sm text-right">
              <p>{payment && `결제할 금액: ${payment.toLocaleString()}원`}</p>
              <p>
                {balance &&
                  `* 나의 소울페이 잔액: ${balance.toLocaleString()}원`}
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 flex w-full gap-2.5 p-2.5">
            {lbtntext !== undefined && (
              <button
                onClick={() => lonclick?.()}
                className="w-full h-12 border border-[#eaeaea] rounded-lg"
              >
                {lbtntext}
              </button>
            )}
            <button
              onClick={() => ronclick?.()}
              className="w-full h-12 rounded-lg text-white bg-customOrange"
            >
              {rbtntext}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export type { ModalInfo };
