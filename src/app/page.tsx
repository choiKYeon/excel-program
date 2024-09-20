// src/app/page.tsx
'use client'; // 클라이언트 컴포넌트로 선언

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = Boolean(localStorage.getItem('authToken')); // 로컬 저장소에서 토큰 확인

    if (isLoggedIn) {
      router.push('/main'); // 메인 페이지로 이동
    } else {
      router.push('/login'); // 로그인 페이지로 이동
    }
  }, [router]);

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}
