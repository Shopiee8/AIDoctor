import React, { forwardRef } from 'react';
import { componentSizes } from '@/lib/sizing-utils';
import { cn } from '@/lib/utils';

/**
 * Available avatar sizes
 */
export type AvatarSize = keyof typeof componentSizes.avatar;

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The size of the avatar
   * @default 'md'
   */
  size?: AvatarSize;
  
  /**
   * The source URL of the avatar image
   */
  src?: string | null;
  
  /**
   * The alt text for the avatar image
   */
  alt?: string;
  
  /**
   * The fallback content to show when the image fails to load
   */
  fallback?: React.ReactNode;
  
  /**
   * Additional CSS class name
   */
  className?: string;
  
  /**
   * If true, adds a status indicator to the avatar
   */
  status?: 'online' | 'offline' | 'busy' | 'away' | null;
  
  /**
   * The shape of the avatar
   * @default 'circle'
   */
  shape?: 'circle' | 'square' | 'rounded';
  
  /**
   * The border color of the avatar
   */
  borderColor?: string;
}

/**
 * An avatar component with consistent sizing and styling.
 * Displays a user's profile picture with fallback content and optional status indicator.
 */
const SizedAvatar = forwardRef<HTMLDivElement, AvatarProps>(({
  size = 'md',
  src,
  alt,
  fallback,
  className,
  status = null,
  shape = 'circle',
  borderColor,
  ...props
}, ref) => {
  const sizeValue = componentSizes.avatar[size];
  const statusSize = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  }[size];
  
  const statusPosition = {
    xs: '-bottom-0.5 -right-0.5',
    sm: '-bottom-0.5 -right-0.5',
    md: '-bottom-1 -right-1',
    lg: '-bottom-1 -right-1',
    xl: '-bottom-1.5 -right-1.5',
  }[size];
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };
  
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded',
    rounded: 'rounded-lg',
  };
  
  const [imgError, setImgError] = React.useState(false);
  const showFallback = !src || imgError;
  
  return (
    <div 
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center bg-muted overflow-hidden',
        'select-none',
        shapeClasses[shape],
        {
          'border-2': !!borderColor,
        },
        className
      )}
      style={{
        width: sizeValue,
        height: sizeValue,
        minWidth: sizeValue,
        minHeight: sizeValue,
        borderColor: borderColor,
      }}
      {...props}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className={cn(
            'w-full h-full object-cover',
            shapeClasses[shape]
          )}
          onError={() => setImgError(true)}
        />
      ) : (
        <div 
          className={cn(
            'w-full h-full flex items-center justify-center',
            'bg-muted text-muted-foreground',
            {
              'text-xs': size === 'xs',
              'text-sm': size === 'sm',
              'text-base': size === 'md',
              'text-lg': size === 'lg',
              'text-xl': size === 'xl',
            }
          )}
        >
          {fallback || (
            <svg
              className="w-3/4 h-3/4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </div>
      )}
      
      {status && (
        <span
          className={cn(
            'absolute rounded-full border-2 border-background',
            statusColors[status] || 'bg-gray-400',
            statusSize,
            statusPosition
          )}
        />
      )}
    </div>
  );
});

SizedAvatar.displayName = 'SizedAvatar';

export { SizedAvatar };
export type { AvatarProps as SizedAvatarProps };
