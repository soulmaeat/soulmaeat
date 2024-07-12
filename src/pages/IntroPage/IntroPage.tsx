import { FC, useState } from 'react';
import { LoginModal } from '../../components/LoginModal';
import { SignUp } from './SignUp';
import { useNavigate } from 'react-router-dom';

export const IntroPage: FC = () => {
  const [loginModal, setLoginModal] = useState<boolean>(false);
  // const [signUp, setSignUp] = useState<boolean>(false);
  const navigate = useNavigate();

  const closeModal = () => {
    setLoginModal(false);
  };

  return (
    <>
        {loginModal && <LoginModal closeModal={closeModal}/>}
      <section className="justify-center w-full h-full max-w-3xl mx-auto text-center bg-[#fff7e5] p-5 flex flex-col">
        <div className="w-211">
          <p className="mt-6 my-5">
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
          <img src={'./img/logoIllu.svg'} className="mx-auto py-3 my-5" alt="logo" />
          <div className="my-10">
            <button
              onClick={()=> setLoginModal(!loginModal)}
              className="w-full py-2 text-2xl bg-[#d75b22] text-white font-semibold rounded-full"
            >
              로그인
            </button>
            <br />
            <button 
              onClick={() => navigate('/signup')}
              className="w-full py-2 my-5 text-2xl bg-[#d75b22] text-white font-semibold rounded-full">
              회원가입
            </button>
          </div>
        </div>
      </section>
    </>
  );
};