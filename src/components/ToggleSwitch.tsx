"use client";

import { useState } from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  className?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  className = ''
}: ToggleSwitchProps) {
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: {
      track: 'w-9 h-5',
      thumb: 'w-4 h-4',
      thumbTranslate: 'translate-x-4',
      icon: 'w-2.5 h-2.5'
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      thumbTranslate: 'translate-x-5',
      icon: 'w-3 h-3'
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      thumbTranslate: 'translate-x-7',
      icon: 'w-3.5 h-3.5'
    }
  };

  const currentSize = sizeClasses[size];

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {(label || description) && (
        <div className="flex-1 mr-4">
          {label && (
            <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}
      
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={`
          relative inline-flex items-center justify-center
          ${currentSize.track}
          rounded-full transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-4 focus:ring-offset-2
          ${disabled 
            ? 'cursor-not-allowed opacity-50' 
            : 'cursor-pointer hover:shadow-md active:scale-95'
          }
          ${checked
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25'
            : 'bg-gray-200 dark:bg-gray-700 shadow-inner'
          }
          ${isPressed ? 'scale-95' : ''}
          focus:ring-green-500/20 dark:focus:ring-green-400/20
        `}
      >
        {/* Track background with gradient */}
        <div className={`
          absolute inset-0 rounded-full transition-all duration-300
          ${checked 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gray-200 dark:bg-gray-700'
          }
        `} />
        
        {/* Thumb */}
        <div
          className={`
            relative ${currentSize.thumb}
            bg-white rounded-full shadow-lg
            transition-all duration-300 ease-in-out
            transform ${checked ? currentSize.thumbTranslate : 'translate-x-0.5'}
            ${isPressed ? 'scale-90' : 'scale-100'}
            ${checked 
              ? 'shadow-green-500/25' 
              : 'shadow-gray-400/25 dark:shadow-gray-600/25'
            }
          `}
        >
          {/* Checkmark icon when enabled */}
          {checked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className={`${currentSize.icon} text-green-600 dark:text-green-400`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          )}
          
          {/* X icon when disabled */}
          {!checked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className={`${currentSize.icon} text-gray-400 dark:text-gray-500`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          )}
        </div>
        
        {/* Ripple effect */}
        <div className={`
          absolute inset-0 rounded-full
          transition-all duration-300
          ${checked 
            ? 'bg-green-500/10 dark:bg-green-400/10' 
            : 'bg-gray-500/5 dark:bg-gray-400/5'
          }
          ${isPressed ? 'scale-110 opacity-50' : 'scale-100 opacity-0'}
        `} />
      </button>
    </div>
  );
} 