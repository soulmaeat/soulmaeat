import {FC} from 'react'


export const IntroPage:FC=()=> {
  return (
    <section className="
    w-full max-w-3xl
    mx-auto
    text-center 
    bg-[#fff7e5]
    p-5
    "
    >
      <p className="pt-"><img src={'./img/logoSubTitle.png'} className="mx-auto" alt="logo"/></p>
      <h1 className="pt-"><img src={'./img/logoSoulmaEat.png'} className="mx-auto" alt="logo"/></h1>
        <img src={'./img/logoIllu.svg'} className="mx-auto pt-" alt="logo" />
        <div className="my-">
  <button className="w-64 px- py- my- text-2xl bg-[#d75b22] text-white font-semibold rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75">로그인</button><br/>
  <button className="w-64 px- py- my- text-2xl bg-[#d75b22] text-white font-semibold rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75">회원가입</button>
</div>
    </section>
  )
}
