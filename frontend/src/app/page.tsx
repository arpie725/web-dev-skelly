'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyToken, loginUser } from '@/api/auth';


/*
Entry point for the Web App
- Attempts to find user token
- Either brings them to the login / register page, or user dashboard page
*/

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }
    // send token to backend for verification
    const checkToken = async () => {
      const res = await verifyToken(token);
      if (res.valid) {
        router.push('/dashboard');
      } else {
        router.push('/auth');
      }
    };

    checkToken();
  }, []);

  return (
    // Shows a basic spinner while trying to find user's token
    <div className='flex items-center justify-center min-h-screen'>
      <div className='h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500'></div>
    </div>
  );
}
