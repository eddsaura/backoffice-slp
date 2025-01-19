import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({
  label,
  error,
  className = '',
  children,
  ...props
}: SelectProps) {
  const selectClasses = `
    block w-full rounded-md border-gray-300 shadow-sm 
    focus:border-blue-500 focus:ring-blue-500 py-2 pl-3 pr-10
    appearance-none
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
        <select className={selectClasses} {...props}>
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}