import React, { forwardRef, InputHTMLAttributes } from 'react';
import { componentSizes } from '@/lib/sizing-utils';
import { cn } from '@/lib/utils';

/**
 * Available input sizes
 */
export type InputSize = keyof typeof componentSizes.input;

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * The size of the input
   * @default 'md'
   */
  inputSize?: InputSize;
  
  /**
   * If true, the input will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * If true, the input will show an error state
   * @default false
   */
  error?: boolean;
  
  /**
   * The error message to display below the input
   */
  errorMessage?: string;
  
  /**
   * The label text to display above the input
   */
  label?: string;
  
  /**
   * The helper text to display below the input
   */
  helperText?: string;
  
  /**
   * The start adornment to display inside the input
   */
  startAdornment?: React.ReactNode;
  
  /**
   * The end adornment to display inside the input
   */
  endAdornment?: React.ReactNode;
}

/**
 * An input component with consistent sizing and styling.
 * Provides a styled input with optional label, helper text, and error states.
 */
const SizedInput = forwardRef<HTMLInputElement, InputProps>(({
  className,
  inputSize = 'md',
  fullWidth = false,
  error = false,
  errorMessage,
  label,
  helperText,
  startAdornment,
  endAdornment,
  disabled,
  ...props
}, ref) => {
  const sizeStyles = componentSizes.input[inputSize];
  const hasError = error || !!errorMessage;
  const showHelperText = hasError || helperText;
  
  return (
    <div className={cn('flex flex-col space-y-1', { 'w-full': fullWidth })}>
      {label && (
        <label 
          className={cn(
            'text-sm font-medium',
            hasError ? 'text-destructive' : 'text-foreground',
            disabled && 'text-muted-foreground/50'
          )}
          htmlFor={props.id}
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {startAdornment && (
          <div className="absolute left-3 flex items-center pointer-events-none">
            {startAdornment}
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            'flex w-full bg-background text-foreground',
            'border border-input ring-offset-background',
            'placeholder:text-muted-foreground/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-200',
            hasError 
              ? 'border-destructive focus-visible:ring-destructive/30' 
              : 'focus:border-primary',
            startAdornment ? 'pl-10' : 'pl-3',
            endAdornment ? 'pr-10' : 'pr-3',
            sizeStyles.paddingY,
            sizeStyles.fontSize,
            sizeStyles.borderRadius,
            className
          )}
          disabled={disabled}
          style={{
            minHeight: sizeStyles.height,
          }}
          {...props}
        />
        
        {endAdornment && (
          <div className="absolute right-3 flex items-center pointer-events-none">
            {endAdornment}
          </div>
        )}
      </div>
      
      {showHelperText && (
        <p 
          className={cn(
            'text-xs',
            hasError ? 'text-destructive' : 'text-muted-foreground',
            disabled && 'text-muted-foreground/50'
          )}
        >
          {hasError ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
});

SizedInput.displayName = 'SizedInput';

export { SizedInput };
export type { InputProps as SizedInputProps, InputSize as SizedInputSize };
