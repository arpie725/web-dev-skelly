'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyToken } from '@/api/auth';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    // send token to backend for verification
    const checkToken = async () => {
      const res = await verifyToken(token);
      if (res.valid) {
        setUser(res.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, []);

  if (!isAuthenticated) {
    // route to the login/register page
    return (
      <div>
        <h1>TODO: Create Login / Register Page</h1>
      </div>
    );
  } else {
    return (
      // route to the mainpage
      <div>
        <h1>TODO: Create MainPage</h1>
      </div>
    );
  }
}
