import { FC, useState, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Main } from './MainPage';

interface LoginModalProps {
  closeModal: () => void;
}

export const LoginModal: FC<LoginModalProps> = ({ closeModal }) => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwdRef = useRef<HTMLInputElement | null>(null);
  const [loginUser, setLoginUser] = useState({ email: '', passwd: '' });

  // const url = import.meta.env.VITE_API_URL;

  const onChangeHandler = (e: FormEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;
    setLoginUser({ ...loginUser, [name]: value });
    console.log('loginUser: ', loginUser);
  };

  const onClickHandler = (e: any) => {
    e.preventDefault();
    // alert('a')
    if (!loginUser.email) {
      alert('아이디를 입력하세요');
      if (emailRef.current) {
        emailRef.current.focus();
      }
      return;
    }
    if (!loginUser.passwd) {
      alert('비밀번호를 입력하세요');
      if (passwdRef.current) {
        passwdRef.current.focus();
      }
      return;
    }

    isLogin();
  };

  const isLogin = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/api/login`, {
        email: loginUser.email,
        password: loginUser.passwd,
      });

      console.log(loginUser.email);

      if (res.status === 200) {
        const data = res.data;
        console.log(data);
        sessionStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/');

      } else {
        console.log('에러 발생');
        sessionStorage.clear(); // 세션 스토리지 클리어(저장한 정보 삭제됨)
        sessionStorage.removeItem('userInfo'); // userInfo에 해당하는 값만 삭제
        setLoginUser({ email: '', passwd: '' });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[340px] h-[400px] rounded-xl shadow-2xl  max-w-3xl mx-auto text-center p-5 flex flex-col ... space-y-4">
        <button onClick={closeModal}>
          <img
            src={'./img/closeBtn.png'}
            className="ml-auto"
            alt="closeButton"
          />
        </button>
        <h1>
          <img src={'./img/logoSoulmaEat.png'} className="mx-auto" alt="logo" />
        </h1>
        <dl>
          <dt className="text-2xl text-black-500 text-left font-semibold py-3">
            로그인
          </dt>
          <dd>
            <input
              onChange={onChangeHandler}
              value={loginUser.email}
              type="email"
              placeholder="이메일"
              name="email"
              ref={emailRef}
              className="w-full px-1 py-2 text-xl text-gray-800 text-left font-semibold"
            ></input>
            <div className="w-full border-b border-gray-400"></div>
          </dd>
          <dd>
            <input
              onChange={onChangeHandler}
              value={loginUser.passwd}
              type="password"
              placeholder="비밀번호"
              name="passwd"
              ref={passwdRef}
              className="w-full px-1 py-2 text-xl text-gray-800 text-left font-semibold"
            ></input>
            <div className="w-full border-b border-gray-400"></div>
          </dd>
          <dd className="text-right text-l  text-gray-700 py-1">
            {/* <button>비밀번호 찾기</button> */}
          </dd>
        </dl>
        <div>
          <button
            type="submit"
            onClick={onClickHandler}
            // onClick={() => navigate('/main')}
            className="w-full py-2 mb-3 text-2xl bg-[#d75b22] text-white font-semibold rounded-full"
          >
            로그인
          </button>
        </div>
      </div>
    </section>
  );
};
