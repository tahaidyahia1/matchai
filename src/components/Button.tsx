import React from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon: Icon,
  onClick,
  className = '',
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 group';

  const variants = {
    primary: 'bg-gradient-to-r from-matcha-600 to-matcha-700 text-white hover:from-matcha-700 hover:to-matcha-800 focus:ring-matcha-500 shadow-lg shadow-matcha-600/30 hover:shadow-xl hover:shadow-matcha-600/40 hover:-translate-y-0.5',
    secondary: 'bg-white text-charcoal-900 hover:bg-cream-100 focus:ring-matcha-500 shadow-lg hover:shadow-xl border border-cream-200 hover:-translate-y-0.5',
    outline: 'border-2 border-charcoal-900 text-charcoal-900 hover:bg-charcoal-900 hover:text-white focus:ring-charcoal-700 hover:-translate-y-0.5'
  };

  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-10 py-4 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-lg' : ''}
        ${className}
      `}
    >
      {Icon && <Icon className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} ${children ? 'mr-2' : ''} group-hover:scale-110 transition-transform duration-300`} />}
      {children}
    </button>
  );
}