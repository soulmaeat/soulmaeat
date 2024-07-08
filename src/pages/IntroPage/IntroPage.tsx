import { FC, useState } from 'react';
import { LoginModal } from '../LoginModal';
// import { useNavigate } from 'react-router-dom';

export const IntroPage: FC = () => {
  const [loginModal, setLoginModal] = useState<boolean>(false);

  const closeModal = () => {
    setLoginModal(false);
  };

  return (
    <>
        {loginModal && <LoginModal closeModal={closeModal}/>}
      <section className="w-full h-full max-w-3xl mx-auto text-center bg-[#fff7e5] p-5 flex flex-col space-y-4">
        <div className="w-211 space-y-3">
          <p className="mt-6">
            <img
              src={'./img/logoSubTitle.png'}
              className="mx-auto"
              alt="logo"
            />
          </p>
          <h1>
            <img
              src={'./img/logoSoulmaEat.png'}
              className="mx-auto"
              alt="logo"
            />
          </h1>
          <img src={'./img/logoIllu.svg'} className="mx-auto py-3" alt="logo" />
          <div className="my-10">
            <button
              onClick={()=> setLoginModal(!loginModal)}
              className="w-full py-2 text-2xl bg-[#d75b22] text-white font-semibold rounded-full"
            >
              로그인
            </button>
            <br />
            <button className="w-full py-2 my-3 text-2xl bg-[#d75b22] text-white font-semibold rounded-full">
              회원가입
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
