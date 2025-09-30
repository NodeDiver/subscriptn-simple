import React from 'react';

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  type: 'server' | 'shop';
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({ name, imageUrl, type, size = 'md' }: AvatarProps) {
  // Generate initials from name (first 2 letters)
  const getInitials = (name: string): string => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Size variants
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl'
  };

  // Theme colors based on type - softer gradients matching button styles
  const bgColorClass = type === 'server' 
    ? 'bg-gradient-to-br from-slate-600 to-emerald-500 dark:from-slate-700 dark:to-emerald-600' 
    : 'bg-gradient-to-br from-slate-600 to-orange-500 dark:from-slate-700 dark:to-orange-600';

  return (
    <div className="flex-shrink-0">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className={`${sizeClasses[size]} rounded-lg object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} ${bgColorClass} rounded-lg flex items-center justify-center text-white font-semibold shadow-sm`}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}
