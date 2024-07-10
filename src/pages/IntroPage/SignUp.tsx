import { FC, useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

export interface User {
  userid: string;
  passwd: string | undefined;
  email: string | undefined;
}

export interface ResponseUserData {
  result: string;
  data: User;
}

const calculateAgeAndGender = (ssNum: string, ssNumSnd: string): { age: number, gender: string } => {
  const birthYear = parseInt(ssNum.slice(0, 2));
  const birthMonth = parseInt(ssNum.slice(2, 4));
  const birthDay = parseInt(ssNum.slice(4, 6));
  const genderCode = parseInt(ssNumSnd[0]);

  let fullBirthYear;
  if (genderCode === 1 || genderCode === 2) {
    fullBirthYear = 1900 + birthYear;
  } else if (genderCode === 3 || genderCode === 4) {
    fullBirthYear = 2000 + birthYear;
  } else {
    throw new Error('Invalid gender code');
  }

  const today = new Date();
  let age = today.getFullYear() - fullBirthYear;
  if (
    today.getMonth() + 1 < birthMonth ||
    (today.getMonth() + 1 === birthMonth && today.getDate() < birthDay)
  ) {
    age--;
  }
  const gender = genderCode % 2 === 1 ? '남성' : '여성';

  return { age, gender };
};

export const SignUp: FC = () => {
  const [user, setUser] = useState<User>({ userid: '', passwd: '', email: '' });
  const [useridErr, setUseridErr] = useState<boolean>(false);
  const [passwdErr, setPasswdErr] = useState<boolean>(false);
  const [emailErr, setEmailErr] = useState<boolean>(false);
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [passwdMatchErr, setPasswdMatchErr] = useState<boolean>(false);
  const [ssNum, setSsNum] = useState<string>('');
  const [ssNumSnd, setSsNumSnd] = useState<string>('');
  const [ssnErr, setSsnErr] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (ssNum.length === 6 && ssNumSnd.length === 1) {
      try {
        const { age, gender } = calculateAgeAndGender(ssNum, ssNumSnd);
        let ageGroup;
        if (age < 20) {
          ageGroup = '10대';
        } else if (age >= 20 && age < 30) {
          ageGroup = '20대';
        } else if (age >= 30 && age < 40) {
          ageGroup = '30대';
        } else if (age >= 40 && age < 50) {
          ageGroup = '40대';
        } else if (age >= 50 && age < 60) {
          ageGroup = '50대';
        } else {
          ageGroup = '60대 이상';
        }
        console.log(`나이: ${age}, 연령: ${ageGroup}, 성별: ${gender}`);
      } catch (err) {
        console.error((err as Error).message);
      }
    }
  }, [ssNum, ssNumSnd]);

  const onSubmit = (e: FormEvent<HTMLFormElement>): boolean => {
    e.preventDefault();

    let isValid = true;

    let isUserid: boolean = /^([a-zA-Z])[a-zA-Z0-9!_-]{3,7}$/.test(user.userid);
    if (!isUserid) {
      setUseridErr(true);
    } else {
      setUseridErr(false);
    }

    if (user.passwd !== undefined) {
      let isPasswd: boolean = /^[\w!_-]{4,8}$/.test(user.passwd);
      if (!isPasswd) {
        setPasswdErr(true);
      } else {
        setPasswdErr(false);
      }
    } else {
      setPasswdErr(true);
    }

    if (user.email !== undefined) {
      let isEmail: boolean = /^([A-Za-z])[\w-_]+(\.[\w]+)*@([a-zA-Z])+(\.)[a-z]{2,3}$/.test(user.email);
      if (!isEmail) {
        setEmailErr(true);
        return false;
      } else {
        setEmailErr(false);
      }
    } else {
      setEmailErr(true);
    }

    if (user.passwd !== passwordConfirm) {
      setPasswdMatchErr(true);
      return false;
    } else {
      setPasswdMatchErr(false);
    }

    if (!ssNum || !ssNumSnd) {
      setSsnErr(true);
      return false;
    } else {
      setSsnErr(false);
    }

    try {
      const { age, gender } = calculateAgeAndGender(ssNum, ssNumSnd);
      console.log(`Age: ${age}, Gender: ${gender}`);
    } catch (err) {
      console.error((err as Error).message);
      setSsnErr(true);
      return false;
    }

    requestJoin();
    return isValid;
  };

  const url = import.meta.env.VITE_API_URL;
  const requestJoin = async () => {
    try {
      const response: AxiosResponse<ResponseUserData> = await axios.post(`${url}/api/register`, user);
      const responseData: ResponseUserData = response.data;

      if (responseData && responseData.result === 'success') {
        alert('회원가입 완료. 로그인 페이지로 이동합니다');
        navigate('/login');
      } else {
        alert('회원 가입 실패-아이디 중복을 체크하세요');
      }
    } catch (err: any) {
      alert('Error: ' + JSON.stringify(err));
    }
  };

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>): void => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onChangePasswordConfirm = (e: ChangeEvent<HTMLInputElement>): void => {
    setPasswordConfirm(e.target.value);
    if (user.passwd !== e.target.value) {
      setPasswdMatchErr(true);
    } else {
      setPasswdMatchErr(false);
    }
  };

  const onChangeSsNum = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value.length <= 6) {
      setSsNum(value);
      console.log(value);
    }
  };

  const onChangeSsNumSnd = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value.length <= 1) {
      setSsNumSnd(value);
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto text-center p-5 flex flex-col space-y-4">
      <form onSubmit={onSubmit} className="w-211 space-y-9">
        <h1><img src={'./img/logo_signup.png'} className="mx-auto" alt="logo" /></h1>
        <div>
          <ul className="space-y-9">
            <li>
              <div className="flex justify-between">
                <div>
                  <input
                    type="text"
                    onChange={onChangeValue}
                    value={user.userid}
                    placeholder="닉네임"
                    name="userid"
                    className="w-full px-1 py-2 text-xl text-gray-800 text-left font-semibold"
                  />
                  <div className="w-full border-b border-gray-400"></div>
                  {/* {useridErr && <div className="text-red-500 text-left text-base font-normal">닉네임 형식이 잘못되었습니다.</div>} */}
                </div>
                <div>
                  <button type="button" className="w-full px-3 py-2 text-base bg-[#d75b22] text-white rounded-full">중복확인</button>
                </div>
              </div>
            </li>
            <li className="text-xl text-gray-300 text-left font-semibold">
              <input
                type="password"
                onChange={onChangeValue}
                value={user.passwd}
                placeholder="비밀번호"
                name="passwd"
                className="w-full px-1 py-2 text-xl text-gray-800 text-left font-semibold"
              />
              <div className="w-full border-b border-gray-400"></div>
              {passwdErr && <div className="text-red-500 text-left text-base font-normal">비밀번호 형식이 잘못되었습니다.</div>}
            </li>
            <li className="text-xl text-gray-300 text-left font-semibold">
              <input
                type="password"
                onChange={onChangePasswordConfirm}
                value={passwordConfirm}
                placeholder="비밀번호확인"
                name="passwordConfirm"
                className="w-full px-1 py-2 text-xl text-gray-800 text-left font-semibold"
              />
              <div className="w-full border-b border-gray-400"></div>
              {passwdMatchErr && <div className="text-red-500 text-left text-base font-normal">비밀번호가 일치하지 않습니다.</div>}
            </li>
            <li className="text-xl text-gray-300 text-left font-semibold">
              <input
                type="email"
                onChange={onChangeValue}
                value={user.email}
                placeholder="이메일"
                name="email"
                className="w-full px-1 py-2 text-xl text-gray-800 text-left font-semibold"
              />
              <div className="w-full border-b border-gray-400"></div>
              {emailErr && <div className="text-red-500 text-left text-base font-normal">이메일 형식이 잘못되었습니다.</div>}
            </li>
            <li className="text-xl text-black-300 text-left font-semibold">
              <div className="py-2">생년월일</div>
              <div className="flex">
                <div className="pr-4 w-1/2">
                  <input
                    type="number"
                    onChange={onChangeSsNum}
                    value={ssNum}
                    placeholder="9 9 1 2 3 1"
                    name="ssNum"
                    className="no-spinner w-full px-1 py-2 text-xl text-gray-800 text-left font-semibold"
                  />
                  <div className="w-full border-b border-gray-400"></div>
                </div>
                <div className="w-1/2">
                  <input
                    type="number"
                    onChange={onChangeSsNumSnd}
                    value={ssNumSnd}
                    placeholder="1 * * * * * *"
                    name="ssNumSnd"
                    className="no-spinner w-full px-1 py-2 text-xl text-gray-800 text-left font-semibold"
                  />
                  <div className="w-full border-b border-gray-400"></div>
                </div>
              </div>
            </li>
            <li>
              <div className="flex">
                <input type="checkbox" id="myCheckbox" />
                <p className="pl-3 text-xs text-black-300 text-left font-semibold">위치기반 서비스이용을 위해 이용약관에 동의합니다.</p>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 mb-3 text-2xl bg-[#f5f5f5] text-[#BDBDBD] font-semibold rounded-full">회원가입</button>
        </div>
      </form>
    </section>
  );
};