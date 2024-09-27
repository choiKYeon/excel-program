'use client'; // 클라이언트 컴포넌트로 선언

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logo from '/public/logo.png'; // 로고 이미지 파일을 사용하려면 정확한 경로로 수정하세요.

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
      // 한부장님 요청건 페이지 이동
        router.push('/mains'); // 로그인 성공 시 메인 페이지로 이동
  };

  const withHoldingTax = async () => { 
    // 안부장님 요청건 페이지 이동
        router.push('/withholding');
  }

  const withHoldingTaxTest = async () => { 
    // 테스트 페이지 이동
        router.push('/withholdingtest');
  }

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

      <div className="flex flex-col justify-center items-start bg-white w-full max-w-md"> {/* 수직 및 수평 중앙 정렬 */}
        <h1 className="text-3xl font-bold mb-10 text-orange-500">엑셀 계산 프로그램</h1>

        <button
          className="bg-[#fff0dd] hover:bg-[#ffd29a] text-[#ffa027] border-2 border-[#ffa027] font-bold py-2 px-4 w-full max-w-xs rounded-full focus:outline-none focus:shadow-outline mb-4"
          onClick={handleLogin}
        >
          원천세 징수 계산 페이지 이동
        </button>
        <button
          className="bg-[#fff0dd] hover:bg-[#ffd29a] text-[#ffa027] border-2 border-[#ffa027] font-bold py-2 px-4 w-full max-w-xs rounded-full focus:outline-none focus:shadow-outline mb-4"
          onClick={withHoldingTax}
        >
          근무 날짜 계산 페이지 이동
        </button>
        <button
          className="bg-[#fff0dd] hover:bg-[#ffd29a] text-[#ffa027] border-2 border-[#ffa027] font-bold py-2 px-4 w-full max-w-xs rounded-full focus:outline-none focus:shadow-outline"
          onClick={withHoldingTaxTest}
        >
          원천세 테스트 페이지 이동
        </button>
      </div>
    </div>
  );
}
