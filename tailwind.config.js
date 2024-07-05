/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        customOrange: '#D75B22', // 사용자 정의 색상 추가 (메인 컬러)
      },
      borderColor: {
        customOrange: '#D75B22', // 사용자 정의 보더 색상 추가
      },
      backgroundColor: {
        customOrange : '#D75B22',
        customapricot : '#FFEFE8',
      }
    },
  },
  plugins: [],
};

