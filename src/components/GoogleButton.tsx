import React from 'react';

interface GoogleButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function GoogleButton({ onClick, loading = false, disabled = false }: GoogleButtonProps) {
  const isDisabled = disabled || loading;
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-label="Continue with Google"
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-3 
        border border-gray-300 rounded-lg 
        bg-white text-gray-700 font-medium
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed 
        transition-all duration-200
        ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      ) : (
        <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
          G
        </div>
      )}
      <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
    </button>
  );
}
