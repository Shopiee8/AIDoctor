import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { componentSizes } from '@/lib/sizing-utils';
import { cn } from '@/lib/utils';

/**
 * Available button sizes
 */
export type ButtonSize = keyof typeof componentSizes.button;

/**
 * Available button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The size of the button
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * The variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * If true, the button will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * If true, the button will show a loading spinner
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * The content to show when the button is in a loading state
   */
  loadingText?: string;
  
  /**
   * The position of the loading spinner
   * @default 'start'
   */
  loadingPosition?: 'start' | 'end';
  
  /**
   * The icon to display at the start of the button
   */
  leftIcon?: React.ReactNode;
  
  /**
   * The icon to display at the end of the button
   */
  rightIcon?: React.ReactNode;
}

/**
 * A button component with consistent sizing and styling.
 * Built on top of the native button element with additional styling and functionality.
 */
const SizedButton = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className = '',
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  loadingText,
  loadingPosition = 'start',
  leftIcon,
  rightIcon,
  disabled,
  ...props
}, ref) => {
  const sizeStyles = componentSizes.button[size];
  const showLeftIcon = leftIcon && !(isLoading && loadingPosition === 'start');
  const showRightIcon = rightIcon && !(isLoading && loadingPosition === 'end');
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      style={{
        height: sizeStyles.height,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && loadingPosition === 'start' && (
        <span className="mr-2">
          <Spinner size="sm" />
        </span>
      )}
      
      {showLeftIcon && <span className="mr-2">{leftIcon}</span>}
      
      {isLoading && loadingText ? loadingText : children}
      
      {showRightIcon && <span className="ml-2">{rightIcon}</span>}
      
      {isLoading && loadingPosition === 'end' && (
        <span className="ml-2">
          <Spinner size="sm" />
        </span>
      )}
    </button>
  );
});

SizedButton.displayName = 'SizedButton';

// Simple spinner component
const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeMap = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  return (
    <div className={`animate-spin ${sizeMap[size]}`}>
      <svg
        className="h-full w-full text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export { SizedButton };
export type { ButtonProps as SizedButtonProps };
