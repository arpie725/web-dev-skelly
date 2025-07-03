'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/*
Intermediate page used after Google Auth
- Stores the token to localStorage
- Immediately routes to the dashboard page
*/

export default function OAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // get the token from the url
    const token = searchParams.get('token');
    if (token) {
      // set the token into local storage
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  }, [searchParams, router]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <p>Signing you in with Google...</p>
    </div>
  );
}
