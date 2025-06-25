'use client';

import { loginUser } from '@/api/auth';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const router = useRouter();

  async function handleLogin() {
    console.log('Attempting login');
    try {
      await loginUser('test', 'pass');
      console.log('Login Successful');
      router.push('/dashboard');
    } catch (er) {
      console.log('Login failed');
    }
  }

  return (
    <div>
      <h1>AUTH PAGE</h1>
      <button
        className='p-3 rounded-2xl bg-zinc-100 text-black hover:bg-zinc-500 hover:cursor-pointer'
        onClick={handleLogin}
      >
        test login
      </button>
    </div>
  );
};

export default AuthPage;
