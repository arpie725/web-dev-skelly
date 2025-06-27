'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

/*
Navbar to navigate the app
- Built with different screen sizes in mind (sm, md lg)
*/

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu when screen size >= md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  async function handleLogout() {
    console.log('Attempting to logout');
    localStorage.removeItem('token');
    setMenuOpen(false);
    router.push('/auth');
  }
  return (
    <motion.nav
      className='mx-4 mt-2 bg-white rounded-lg px-6 pt-4 flex flex-col items-center relative overflow-hidden'
      animate={menuOpen ? { height: '220px' } : { height: '64px' }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      style={{ minHeight: 64 }}
    >
      {/* Logo */}
      <div className='w-full flex justify-between items-center'>
        <Link
          href='/'
          className='text-xl font-bold text-violet-600'
        >
          MyApp
        </Link>

        {/* Hamburger for small screens */}
        <div
          className='flex md:hidden lg:hidden justify-end gap-4'
          aria-label='Open menu'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='black'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='feather feather-menu'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <line
              x1='3'
              y1='6'
              x2='21'
              y2='6'
              className={twMerge(
                'origin-left transition',
                menuOpen && 'rotate-45 -translate-y-1'
              )}
            ></line>
            <line
              x1='3'
              y1='12'
              x2='21'
              y2='12'
              className={twMerge('transition', menuOpen && 'opacity-0')}
            ></line>
            <line
              x1='3'
              y1='18'
              x2='21'
              y2='18'
              className={twMerge(
                'origin-left transition',
                menuOpen && '-rotate-45 translate-y-1'
              )}
            ></line>
          </svg>
        </div>

        {/* Right side links (hidden on small screens) */}
        <div className='hidden md:flex space-x-4 lg:space-x-6'>
          <Link
            href='/dashboard'
            className='text-gray-700 hover:text-violet-600'
          >
            Dashboard
          </Link>
          <Link
            href='/profile'
            className='text-gray-700 hover:text-violet-600'
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className='text-red-500 hover:underline hover:cursor-pointer'
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className='md:hidden lg:hidden flex flex-col items-center justify-center w-full mt-6'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href='/dashboard'
              className={twMerge(
                'px-4 py-2 w-full text-center rounded hover:bg-violet-50',
                pathname === '/dashboard'
                  ? 'text-violet-700 font-bold'
                  : 'text-gray-700'
              )}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href='/profile'
              className={twMerge(
                'px-4 py-2 w-full text-center rounded hover:bg-violet-50',
                pathname === '/profile'
                  ? 'text-violet-700 font-bold'
                  : 'text-gray-700'
              )}
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className='px-4 py-2 w-full text-center text-red-500 hover:bg-red-50 hover:cursor-pointer rounded'
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
