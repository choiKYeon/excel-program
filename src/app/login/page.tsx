'use client'; // 클라이언트 컴포넌트로 선언

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import logo from '/public/logo.png'; // 로고 이미지 파일을 사용하려면 정확한 경로로 수정하세요.
import { loginUser } from '../../api/generated/endpoints'; // Orval로 생성된 로그인 API 함수 경로를 수정하세요.
import { LoginUserParams } from '../../api/generated/model/loginUserParams'; // Orval로 생성된 로그인 파라미터 타입

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const params: LoginUserParams = { username, password };

      // 로그인 요청 보내기
      const response = await loginUser(params);

      if (response) {
        localStorage.setItem('authToken', response); // 토큰을 로컬 저장소에 저장
        router.push('/main'); // 로그인 성공 시 메인 페이지로 이동
      }
    } catch (error) {
      router.push('/main'); // 임시 api연결 전이기 때문에 넘어가게 설정 추후 지워야함 ! 추후 밑에 주석 풀어야함 ! 
      // console.error('로그인 실패:', error);
      // alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* 왼쪽 로고 섹션 */}
      <div className="flex-1 relative">
        <Image
          src={logo}
          alt="Logo"
          layout="fill"
          objectFit="cover"
          className="p-0"
        />
      </div>

      {/* 오른쪽 로그인 폼 섹션 */}
      <div className="flex flex-col justify-center items-start p-8 bg-white w-full max-w-md"> {/* 수직 및 수평 중앙 정렬 */}
        <h1 className="text-2xl font-bold mb-6 text-orange-500">관리자 로그인</h1>

        {/* ID 입력 필드 */}
        <div className="w-full max-w-xs mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            아이디
          </label>
          <input
            id="username"
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* PW 입력 필드 */}
        <div className="w-full max-w-xs mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* 비밀번호 저장 체크박스 */}
        <div className="flex items-center mb-4">
          <input id="savePassword" type="checkbox" className="mr-2 leading-tight" />
          <label htmlFor="savePassword" className="text-sm text-gray-600">
            비밀번호 저장
          </label>
        </div>

        {/* 로그인 버튼 */}
        <button
          className="bg-[#fff0dd] hover:bg-[#ffd29a] text-[#ffa027] border-2 border-[#ffa027] font-bold py-2 px-4 w-full max-w-xs rounded-full focus:outline-none focus:shadow-outline"
          onClick={handleLogin}
        >
          로그인
        </button>

        {/* 원격상담 및 저작권 정보 */}
        <div className="mt-8 text-left text-gray-600 text-sm">
          <p>원격상담</p>
          <p>Copyright 콜고 유니온 Co.Ltd. All Right</p>
        </div>
      </div>
    </div>
  );
}
