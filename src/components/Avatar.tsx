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

  // Theme colors based on type
  const bgColorClass = type === 'server' 
    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700' 
    : 'bg-gradient-to-br from-orange-400 to-amber-500 dark:from-orange-500 dark:to-amber-600';

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
