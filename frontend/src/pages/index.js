import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getMe } from '../services/authService';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getMe();
        router.push('/dashboard');
      } catch (err) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
