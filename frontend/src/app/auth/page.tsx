'use client';

import { loginUser, registerUser } from '@/api/auth';
import { useRouter } from 'next/navigation';
import InputField from '@/components/auth/InputField';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { useState } from 'react';
import {
  DuplicateEntryError,
  InvalidParamsError,
  knownErrors,
  NotFoundError,
  UnauthorizedError,
} from '@/utils/errors';
import { error } from 'console';

/*
Allows user to login / register
- Calls the 'loginUser' and 'registerUser' helpers from 'api/auth' to make API call to server
- Handles any errors (input validation, user already exists, incorrect password, etc.)
- Offers ability to sign in with Google
*/

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  async function handleSubmit() {
    console.log('Attempting login / register');
    try {
      if (isLogin) {
        // login the user
        await loginUser(username, password);
        console.log('Login Successful');
      } else {
        // register the user
        await registerUser(username, password);
      }
      // push dashboard if login / register was successful
      router.push('/dashboard');
    } catch (er) {
      console.log('Login or Register failed');

      if (knownErrors(er)) {
        if (
          er instanceof NotFoundError ||
          er instanceof DuplicateEntryError ||
          (er instanceof InvalidParamsError && username === '')
        ) {
          setUsernameErrorMessage(er.message);
        }

        if (
          er instanceof UnauthorizedError ||
          (er instanceof InvalidParamsError && password === '')
        ) {
          setPasswordErrorMessage(er.message);
        }
      } else {
        console.log('unexpected error');
        setErrorMessage('Unexpected error');
      }
    }
  }

  function toggleMode() {
    setIsLogin((prev) => !prev);
    setUsername('');
    setPassword('');
    setUsernameErrorMessage('');
    setPasswordErrorMessage('');
  }

  return (
    <div className='max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow-md bg-white'>
      <div className='flex flex-col items-center justify-center mb-4'>
        <h1 className='text-xl font-sans text-violet-600 font-bold  text-center'>
          {isLogin ? 'Login' : 'Register'}
        </h1>
        <p className='text-red-500'>{errorMessage}</p>
      </div>

      <InputField
        label='Username'
        errorMessage={usernameErrorMessage}
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setUsernameErrorMessage('');
        }}
        placeholder='Enter username'
      />

      <InputField
        label='Password'
        errorMessage={passwordErrorMessage}
        type='password'
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordErrorMessage('');
        }}
        placeholder='Enter password'
      />

      <div className=''>
        <button
          onClick={handleSubmit}
          className='w-full p-3 mt-2 mb-2 text-white bg-violet-600 rounded-lg duration-150 hover:bg-violet-700 hover:cursor-pointer'
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
        <div className='flex justify-center'>
          <button
            className='px-3 text-violet-600 hover:underline hover:cursor-pointer'
            onClick={toggleMode}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
      <div className='border-t-2 border-violet-600/20 pt-3 mt-6 mb-3'>
        <GoogleSignInButton />
      </div>
    </div>
  );
};

export default AuthPage;
