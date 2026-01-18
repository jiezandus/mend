import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'disabled';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  disabled = false
}) => {
  const baseStyle = "px-6 py-3 rounded-2xl border-2 border-black font-bold text-lg transform transition-transform active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] select-none";
  
  let variantStyle = "";
  switch (variant) {
    case 'primary':
      variantStyle = "bg-softBlue hover:bg-blue-200 text-ink";
      break;
    case 'secondary':
      variantStyle = "bg-white hover:bg-gray-100 text-ink";
      break;
    case 'danger':
      variantStyle = "bg-red-400 hover:bg-red-500 text-white";
      break;
    case 'disabled':
      variantStyle = "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none border-gray-400";
      break;
  }

  return (
    <button 
      onClick={disabled ? undefined : onClick} 
      className={`${baseStyle} ${variantStyle} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
