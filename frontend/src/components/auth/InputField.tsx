'use client';

import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export default function InputField({
  label,
  className,
  errorMessage,
  ...props
}: {
  label: string;
  className?: string;
  errorMessage?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className='mb-4'>
      <div className='flex justify-between'>
        <label className='block mb-1 text-sm font-medium text-gray-700'>
          {label}
        </label>
        <p className='text-sm text-red-500 italic'>{errorMessage}</p>
      </div>
      <input
        {...props}
        className={twMerge(
          'text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500',
          errorMessage
            ? 'border-red-500 ring-2 ring-red-500 focus:ring-red-500'
            : '',
          className
        )}
      />
    </div>
  );
}
