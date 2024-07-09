import { FC, useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios'

// 사용자 정보를 나타내는 인터페이스를 정의
export interface User {
  userid: string
  passwd: string | undefined
  email: string | undefined
}

// 백엔드에서 응답할 데이터 구조를 나타내는 인터페이스를 정의
export interface ResponseUserData {
  result: string
  data: User
}

export const SignUp: FC = () => {
  const [user, setUser] = useState<User>({ userid: '', passwd: '', email: '' })
  const [useridErr, setUseridErr] = useState<boolean>(false)
  const [passwdErr, setPasswdErr] = useState<boolean>(false)
  const [emailErr, setEmailErr] = useState<boolean>(false)
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [passwdMatchErr, setPasswdMatchErr] = useState<boolean>(false)
  const navigate = useNavigate()

  const onSubmit = (e: FormEvent<HTMLFormElement>): boolean => {
    e.preventDefault()

    let isUserid: boolean = /^([a-zA-Z])[a-zA-Z0-9!_-]{3,7}$/.test(user.userid)
    if (!isUserid) {
      setUseridErr(true)
    } else {
      setUseridErr(false)
    }

    if (user.passwd !== undefined) {
      let isPasswd: boolean = /^[\w!_-]{4,8}$/.test(user.passwd)
      if (!isPasswd) {
        setPasswdErr(true)
      } else {
        setPasswdErr(false)
      }
    } else {
      setPasswdErr(true)
    }

    if (user.email !== undefined) {
      let isEmail: boolean = /^([A-Za-z])[\w-_]+(\.[\w]+)*@([a-zA-Z])+(\.)[a-z]{2,3}$/.test(user.email)
      if (!isEmail) {
        setEmailErr(true)
        return false;
      } else {
        setEmailErr(false)
      }
    } else {
      setEmailErr(true)
    }

    if (user.passwd !== passwordConfirm) {
      setPasswdMatchErr(true)
      return false
    } else {
      setPasswdMatchErr(false)
    }

    requestJoin()
    return true;
  }

  const url = import.meta.env.VITE_API_URL;
  const requestJoin = async () => {
    try {
      const response: AxiosResponse<ResponseUserData> = await axios.post(`${url}/api/register`, user)
      const responseData: ResponseUserData = response.data

      if (responseData && responseData.result === 'success') {
        alert('회원가입 완료. 로그인 페이지로 이동합니다')
        navigate('/login')
      } else {
        alert('회원 가입 실패-아이디 중복을 체크하세요')
      }
    } catch (err: any) {
      alert('Error: ' + JSON.stringify(err))
    }
  }

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>): void => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const onChangePasswordConfirm = (e: ChangeEvent<HTMLInputElement>): void => {
    setPasswordConfirm(e.target.value)
  }

  return (
    <section className="w-full max-w-3xl mx-auto text-center p-5 flex flex-col ... space-y-4">
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
                    placeholder="아이디"
                    name="userid"
                    className="w-full px-1 py-2 text-xl text-gray-800 text-left font-semibold"
                  />
                  <div className="w-full border-b border-gray-400"></div>
                  {useridErr && <div className="text-red-500 text-left text-base font-normal">아이디 형식이 잘못되었습니다.</div>}
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
                    placeholder="9 9 1 2 3 1"
                    name="ssNum"
                    className="no-spinner w-full px-1 py-2 text-xl text-gray-800 text-left font-semibold"
                  />
                  <div className="w-full border-b border-gray-400"></div>
                </div>
                <div className="w-1/2">
                  <input
                    type="number"
                    placeholder="1 * * * * * *"
                    name="ssNum"
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
            className="w-full py-2 mb-3 text-2xl bg-[#d75b22] text-white font-semibold rounded-full">회원가입</button>
        </div>
      </form>
    </section>
  )
}
