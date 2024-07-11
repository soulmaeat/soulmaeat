# :shallow_pan_of_food: 소울메eat

![](https://private-user-images.githubusercontent.com/52684457/345726742-eaa9969c-ac06-4711-a0a4-73e77295cbc2.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjA2ODM3MDQsIm5iZiI6MTcyMDY4MzQwNCwicGF0aCI6Ii81MjY4NDQ1Ny8zNDU3MjY3NDItZWFhOTk2OWMtYWMwNi00NzExLWEwYTQtNzNlNzcyOTVjYmMyLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA3MTElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNzExVDA3MzY0NFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTU1ZjQ5Zjg2ZjRlNjEyYzQxMzkyY2Q5YjcyODM5ZTQwMWI2ZGUyNGM3Yjk0NjBmNDQ4ODQyOGQ2ZDQxYTJmYzQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.Vfn-sTwzGBNguyaDr-nXtIClIUG4guZ_5Qv9Wfbs0kI)

### 소울메잇트

- 음식 친구 서비스 플랫폼



### 프로젝트 조명

- soulmaeat 소울메잇트



### 프로젝트 팀원

**팀장** : 이해인
**팀원** : 김영은, 신지선, 임은지, 황지은



### 프로젝트 주제

밥친구 만들기 프로젝트.  전체가구 중 1인 가구 수 34.5% 인 시대에 외로운 혼밥족을 위한 동네 밥 같이 먹을 사람 찾아주기



### 프로젝트 목적

이용자 참여형 서비스의 장점을 기반으로 위치기반 api를 활용해서 1인가구의 고질적인 식도락 문제를 해결해주는 서비스 제공



### 프로젝트 수행 도구

- 기획 : 피그마 
- 협업 : 지라, Github, Discord, Zoom, Jira
- 배포 : Vercel
- 개발 : TypeScript, React, JavaScripts, HTML5, CSS3



### 필수 기능

1. 게시글 올리기(음식점선택, 인원수 선택, 시간 선택 등..)

2. 위치 정보 기능(현위치를 기반으로 피드 올라옴)/지도 api

3. 피드 화면 - 현위치 기반 올라온 게시글 정보제공

4. 피드 게시글 상세페이지 - 해당 글 정보 제공 & 참여하기 페이지

5. 영수증&계산 합계 기능

6. 평가하기(좋아요)

7. 로그인 / 회원가입

8. 프로필 - 매너(신뢰도)수치화 기능



### WBS 업무 분업 구조 7/3 - 7/13

07/03 : 기획 및 레퍼런스 서치. 어플리케이션 정보 구조도 및 디자인
07/04 : 디자인 페이지 작업, 개발 역할 분담, 깃헙으로 브렌치 규칙 정하기. 
07/05 :
07/06 :
07/07 :
07/08 :
07/09 :
07/10 :
07/11 :
07/12 :
07/13 :



### 기획 과정

- Figma

![](https://private-user-images.githubusercontent.com/52684457/345679874-1caec670-4953-4411-946a-b8d61be52a19.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjA2ODM3MTYsIm5iZiI6MTcyMDY4MzQxNiwicGF0aCI6Ii81MjY4NDQ1Ny8zNDU2Nzk4NzQtMWNhZWM2NzAtNDk1My00NDExLTk0NmEtYjhkNjFiZTUyYTE5LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA3MTElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNzExVDA3MzY1NlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWMwNTg2ZjY1ZTI1MjU5OTQ0N2JhZjY5NzAyNmM3OTVmODdkMjU0NjE5YzkzNzU0ODFkM2MwZWNjZTFlMDQwNDcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.5wJCRfI5f4LfZTb_q5BId3f4t6j2at3x-Y4gNXV2wDY)

- [Figma 기획안](https://www.figma.com/proto/nl1GeA8lHCNK34NjcPPijo/SoulmaEat?page-id=43%3A2&node-id=62-498&viewport=53%2C27%2C0.1&t=tYoZbF4zuzQJeSnN-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=62%3A618&show-proto-sidebar=1)

>  **Branch 이름**
>
> "feature/담당브랜치명"
>
> 예) feature/detailPage

##### 커밋 이름 규칙

1. Feat : 기능 구현

2. Fix : 수정 사항
3. Bug : 버그나 에러
4. Doc : 문서 파일
5. Add : 새 파일
6. Remove : 삭제
7. Style : css

##### 함수 규칙

- 화살표 함수(익명 함수)

