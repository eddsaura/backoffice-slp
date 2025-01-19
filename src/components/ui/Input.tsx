import React from 'react';
import { Euro } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  isCurrency?: boolean;
}

export function Input({
  label,
  error,
  className = '',
  startIcon,
  isCurrency,
  type = 'text',
  ...props
}: InputProps) {
  const inputClasses = `
    block w-full rounded-md border-gray-300 shadow-sm 
    focus:border-blue-500 focus:ring-blue-500
    py-2
    ${startIcon || isCurrency ? 'pl-8 px-3' : 'px-3'}
    ${error ? 'border-red-300' : ''}
    ${className}
  `;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {isCurrency && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">€</span>
          </div>
        )}
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}
        <input type={type} className={inputClasses} {...props} />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}