import {FC} from 'react'
import { useNavigate } from 'react-router-dom';
import { Main } from '../main';

interface LoginModalProps {
  closeModal: () => void;
}

export const LoginModal:FC<LoginModalProps>=({ closeModal })=> {
  const navigate = useNavigate();

  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className= "bg-white w-[340px] h-[400px] rounded-xl shadow-2xl  max-w-3xl mx-auto text-center p-5 flex flex-col ... space-y-4">
        <button onClick={closeModal}><img src={'./img/closeBtn.png'} className="ml-auto" alt="closeButton"/></button>
        <h1><img src={'./img/logoSoulmaEat.png'} className="mx-auto" alt="logo"/></h1>
        <dl>
          <dt className="text-2xl text-black-500 text-left font-semibold py-3">로그인</dt>
              <dd>
                  <input type="text" value="아이디" name="userid" className="w-full px-1 py-2 text-xl text-gray-300 text-left font-semibold"></input>
                  <div className="w-full border-b border-gray-400"></div>
              </dd>
              <dd>
                  <input type="text" value="비밀번호" name="password" className="w-full px-1 py-2 text-xl text-gray-300 text-left font-semibold"></input>
                  <div className="w-full border-b border-gray-400"></div>
              </dd>
              <dd className="text-right text-l  text-gray-700 py-1">
                  {/* <button>비밀번호 찾기</button> */}
              </dd>
        </dl>
        <div>
              <button 
              onClick={() => navigate('/main')}
              className="w-full py-2 mb-3 text-2xl bg-[#d75b22] text-white font-semibold rounded-full">로그인</button>
        </div>
      </div>
    </section>
  )
}
