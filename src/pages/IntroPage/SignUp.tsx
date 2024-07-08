import {FC} from 'react'

export const SignUp:FC=()=> {
  return (
    <section className="w-full max-w-3xl mx-auto text-center p-5 flex flex-col ... space-y-4">
      <div className="w-211 space-y-9">
        <h1><img src={'./img/logo_signup.png'} className="mx-auto" alt="logo"/></h1>
        <div>
          <ul className="space-y-9">
            <li>
              <div className="flex justify-between">
                <div>
                <input type="text" value="아이디" name="userid" className="w-full px-1 py-2 text-xl text-gray-300 text-left font-semibold"></input>
                <div className="w-full border-b border-gray-400"></div>
                </div>
                <div>
                  <button className="w-full px-3 py-2 text-base bg-[#d75b22] text-white rounded-full">중복확인</button>
                </div>
              </div>
              
            </li>
            <li className="text-xl text-gray-300 text-left font-semibold">
              <input type="text" value="비밀번호" name="password" className="w-full px-1 py-2 text-xl text-gray-300 text-left font-semibold"></input>
              <div className="w-full border-b border-gray-400"></div>
            </li>
            <li className="text-xl text-gray-300 text-left font-semibold">
            <input type="text" value="비밀번호확인" name="passwordConfirm" className="w-full px-1 py-2 text-xl text-gray-300 text-left font-semibold"></input>
              <div className="w-full border-b border-gray-400"></div>
            </li>
            <li className="text-xl text-gray-300 text-left font-semibold">
            <input type="email" value="이메일" name="email" className="w-full px-1 py-2 text-xl text-gray-300 text-left font-semibold"></input>  
              <div className="w-full border-b border-gray-400"></div>
            </li>
            <li className="text-xl text-black-300 text-left font-semibold">
              <div className="py-2">생년월일</div>
                <div className="flex">
                  <div className="pr-4 w-1/2">
                    <input type="text" value="9 9 1 2 3 1" name="ssNum" className="w-full px-1 py-2 text-xl text-gray-300 text-left font-semibold"></input>
                    <div className="w-full border-b border-gray-400"></div>
                  </div>
                    <div className="w-1/2">
                      <div>
                      <input type="text" value="1 * * * * * *" name="ssNum" className="w-full px-1 py-2 text-xl text-gray-300 text-left font-semibold"></input>
                      <div className="w-full border-b border-gray-400"></div>
                      </div>  
                  </div>
                </div>  
            </li>
            <li>
              <div className="flex">
                <input type="checkbox" id="myCheckbox"/>
                <p className="pl-3 text-xs text-black-300 text-left font-semibold">위치기반 서비스이용을 위해 이용약관에 동의합니다.</p>
              </div>
            </li>
          </ul>
        </div>
        <div>
            <button className="w-full py-1 mb-3 text-2xl bg-[#d75b22] text-white font-semibold rounded-full">회원가입</button>
        </div>
      </div>
    </section>
  )
}
