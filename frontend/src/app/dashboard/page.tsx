'use client';

import Navbar from '@/components/common/NavBar';

const DashboardPage = () => {
  return (
    <div className='bg-background'>
      <Navbar />
      <section className='mt-10'>
        <div className='container mx-auto border border-blue-500'>
          <h1 className='text-xl'>Dashboard Page</h1>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
