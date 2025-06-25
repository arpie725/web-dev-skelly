'use client';

import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const router = useRouter();

  async function handleLogout() {
    console.log('Attempting to logout');
    localStorage.removeItem('token');
    router.push('/auth');
  }
  return (
    <div>
      <h1>DASHBOARD PAGE</h1>
      <button
        className='p-3 rounded-2xl bg-zinc-100 text-black hover:bg-zinc-500 hover:cursor-pointer'
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
