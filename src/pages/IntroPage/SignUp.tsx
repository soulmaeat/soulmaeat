import { FC, useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

export interface User {
  userId: string;
  password: string | undefined;
  email: string | undefined;
  gender?: string;
  age?: any | undefined;
  ageGroup?: string | undefined;
}

export interface ResponseUserData {
  result: string;
  data: User;
}

const calculateAgeAndGender = (
  ssNum: string,
  ssNumSnd: string
): { age: number; gender: string } => {
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
  const [user, setUser] = useState<User>({
    userId: '',
    password: '',
    email: '',
    gender: '',
    age: '',
    ageGroup: '',
  });
  const [userIdErr, setuserIdErr] = useState<boolean>(false);
  const [passwordErr, setpasswordErr] = useState<boolean>(false);
  const [emailErr, setEmailErr] = useState<boolean>(false);
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [passwordMatchErr, setpasswordMatchErr] = useState<boolean>(false);
  const [ssNum, setSsNum] = useState<string>('');
  const [ssNumSnd, setSsNumSnd] = useState<string>('');
  const [ssnErr, setSsnErr] = useState<boolean>(false);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false); // 중복확인 상태 추가
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null); // 중복확인 결과 추가
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

        setUser((prevUser) => ({ ...prevUser, gender, age, ageGroup }));

        console.log(user);
      } catch (err) {
        console.error((err as Error).message);
      }
    }
  }, [ssNum, ssNumSnd]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValid = true;

    let isuserId: boolean = /^([a-zA-Z])[a-zA-Z0-9!_-]{3,7}$/.test(user.userId);
    if (!isuserId) {
      setuserIdErr(true);
    } else {
      setuserIdErr(false);
    }

    if (user.password !== undefined) {
      let ispassword: boolean = /^[\w!_-]{4,8}$/.test(user.password);
      if (!ispassword) {
        setpasswordErr(true);
      } else {
        setpasswordErr(false);
      }
    } else {
      setpasswordErr(true);
    }

    if (user.email !== undefined) {
      let isEmail: boolean =
        /^([A-Za-z])[\w-_]+(\.[\w]+)*@([a-zA-Z])+(\.)[a-z]{2,3}$/.test(
          user.email
        );
      if (!isEmail) {
        setEmailErr(true);
        return false;
      } else {
        setEmailErr(false);
      }
    } else {
      setEmailErr(true);
    }

    if (user.password !== passwordConfirm) {
      setpasswordMatchErr(true);
      return false;
    } else {
      setpasswordMatchErr(false);
    }

    if (!ssNum || !ssNumSnd) {
      setSsnErr(true);
      return false;
    } else {
      setSsnErr(false);
    }

    try {
      await requestJoin();
    } catch (err) {
      console.error('Error during sign up:', err);
    }
  };

  const registerUser = {
    userId: user.userId,
    password: user.password,
    email: user.email,
    gender: user.gender,
    age: user.ageGroup,
  };
  
  const url = import.meta.env.VITE_API_URL;
  const requestJoin = async () => {
    try {
      

      const response: AxiosResponse<User> = await axios.post(
        `${url}/api/register`,
        registerUser
      );
      const responseData: User = response.data;
      console.log('Response Data:', responseData); // 응답 데이터 확인

      // 여기서 응답 데이터의 특정 필드를 이용해 성공 여부를 판단합니다.
      if (response.status === 404) {
        console.log('Unexpected response data:', responseData);
        alert('회원 가입 실패-아이디 중복을 체크하세요');
        return;
      }
      // userId 필드가 있으면 성공으로 간주
      alert('회원가입 완료. 로그인 페이지로 이동합니다');
      sessionStorage.setItem('userId', responseData.userId);
      navigate(`/onboard`);
    } catch (err: any) {
      console.error('Error response:', err.response); // 에러 메시지 출력
      alert('Error: ' + JSON.stringify(err.response));
    }
  };

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>): void => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onChangePasswordConfirm = (e: ChangeEvent<HTMLInputElement>): void => {
    setPasswordConfirm(e.target.value);
    if (user.password !== e.target.value) {
      setpasswordMatchErr(true);
    } else {
      setpasswordMatchErr(false);
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

  const userId =  user.userId;
  const checkUsername = async () => {
    // setCheckingUsername(true);
    try {
      console.log(userId)
      const response: AxiosResponse = await axios.post(
        `${url}/api/check`, { userId }
      );
  
      console.log('Response:', response); // 응답 데이터 확인
  
      if (response.status === 201) {
        setUsernameAvailable(true);
      } else if (response.status === 404) {
        setUsernameAvailable(false);
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(false); // 에러 발생 시 중복된 사용자로 처리
    }
  };

  console.log(usernameAvailable)

  return (
    <section className="max-w-3xl mx-auto text-center p-5 flex flex-col justify-center w-full h-full space-y-4">
      <form onSubmit={onSubmit} className="w-211 space-y-9">
        <h1>
          <img src={'./img/logo_signup.png'} className="mx-auto" alt="logo" />
        </h1>
        <div>
          <ul className="space-y-9">
            <li>
              <div className="flex justify-between">
                <div>
                  <input
                    type="text"
                    onChange={onChangeValue}
                    value={user.userId}
                    placeholder="닉네임"
                    name="userId"
                    className="w-full px-1 py-2 text-xl text-gray-800 text-left font-semibold"
                  />
                  <div className="w-full border-b border-gray-400"></div>
                  {userIdErr && (
                    <div className="text-red-500 text-left text-base font-normal">
                      닉네임 형식이 잘못되었습니다.
                    </div>
                  )}
                  {usernameAvailable == false && (
                    <div className="text-red-500 text-left text-base font-normal">
                      중복된 사용자 ID입니다.
                    </div>
                  )}
                  {usernameAvailable == true && (
                    <div className="text-green-500 text-left text-base font-normal">
                      사용 가능한 ID입니다.
                    </div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={checkUsername}
                    disabled={checkingUsername}
                    className="w-full px-3 py-2 text-base bg-[#d75b22] text-white rounded-full"
                  >
                    중복확인
                  </button>
                </div>
              </div>
            </li>
            <li className="text-xl text-gray-300 text-left font-semibold">
              <input
                type="password"
                onChange={onChangeValue}
                value={user.password}
                placeholder="비밀번호"
                name="password"
                className="w-full px-1 py-2 text-xl text-gray-800 text-left font-semibold"
              />
              <div className="w-full border-b border-gray-400"></div>
              {passwordErr && (
                <div className="text-red-500 text-left text-base font-normal">
                  비밀번호 형식이 잘못되었습니다.
                </div>
              )}
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
              {passwordMatchErr && (
                <div className="text-red-500 text-left text-base font-normal">
                  비밀번호가 일치하지 않습니다.
                </div>
              )}
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
              {emailErr && (
                <div className="text-red-500 text-left text-base font-normal">
                  이메일 형식이 잘못되었습니다.
                </div>
              )}
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
                <p className="pl-3 text-xs text-black-300 text-left font-semibold">
                  위치기반 서비스이용을 위해 이용약관에 동의합니다.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 mb-3 text-2xl bg-[#f5f5f5] text-[#BDBDBD] font-semibold rounded-full"
          >
            다음
          </button>
        </div>
      </form>
    </section>
  );
};
