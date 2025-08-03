import React, { forwardRef, useImperativeHandle, useRef, TextareaHTMLAttributes } from 'react';
import { componentSizes } from '@/lib/sizing-utils';
import { cn } from '@/lib/utils';

/**
 * Available textarea sizes
 */
export type TextareaSize = keyof typeof componentSizes.textarea;

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * The size of the textarea
   * @default 'md'
   */
  textareaSize?: TextareaSize;
  
  /**
   * If true, the textarea will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * If true, the textarea will show an error state
   * @default false
   */
  error?: boolean;
  
  /**
   * The error message to display below the textarea
   */
  errorMessage?: string;
  
  /**
   * The label text to display above the textarea
   */
  label?: string;
  
  /**
   * The helper text to display below the textarea
   */
  helperText?: string;
  
  /**
   * The number of visible text lines
   */
  rows?: number;
  
  /**
   * The minimum number of visible text lines
   */
  minRows?: number;
  
  /**
   * The maximum number of visible text lines
   */
  maxRows?: number;
  
  /**
   * If true, the textarea will automatically adjust its height based on content
   * @default false
   */
  autoResize?: boolean;
  
  /**
   * The character count to display below the textarea
   */
  charCount?: number;
  
  /**
   * The maximum number of characters allowed
   */
  maxLength?: number;
}

/**
 * A textarea component with consistent sizing and styling.
 * Provides a styled multi-line text input with optional label, helper text, and error states.
 */
const SizedTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className,
  textareaSize = 'md',
  fullWidth = false,
  error = false,
  errorMessage,
  label,
  helperText,
  rows,
  minRows = 3,
  maxRows = 10,
  autoResize = false,
  charCount,
  maxLength,
  disabled,
  required,
  ...props
}, ref) => {
  const sizeStyles = componentSizes.textarea[textareaSize];
  const hasError = error || !!errorMessage;
  const showHelperText = hasError || helperText || (maxLength !== undefined && charCount !== undefined);
  const effectiveRows = rows || minRows;
  
  const internalTextareaRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
  
  // Use useImperativeHandle to expose the textarea ref to parent components
  useImperativeHandle(ref, () => internalTextareaRef.current as HTMLTextAreaElement);
  
  // Auto-resize functionality
  React.useEffect(() => {
    const textarea = internalTextareaRef.current;
    if (!autoResize || !textarea) return;
    
    const resizeTextarea = () => {
      // Reset height to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set the height to scrollHeight to fit content
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxRows * 24)}px`; // 24px per line
    };
    
    // Initial resize
    resizeTextarea();
    
    // Add event listener for input changes
    textarea.addEventListener('input', resizeTextarea);
    
    // Cleanup
    return () => {
      textarea.removeEventListener('input', resizeTextarea);
    };
  }, [autoResize, maxRows]);
  
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
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={internalTextareaRef}
          rows={effectiveRows}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
          className={cn(
            'flex w-full bg-background text-foreground',
            'border border-input ring-offset-background',
            'placeholder:text-muted-foreground/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-none',
            'transition-colors duration-200',
            hasError ? 'border-destructive focus-visible:ring-destructive/30' : 'focus:border-primary',
            className
          )}
          style={{
            minHeight: sizeStyles.minHeight,
            padding: sizeStyles.padding,
            fontSize: sizeStyles.fontSize,
            lineHeight: sizeStyles.lineHeight,
            borderRadius: sizeStyles.borderRadius,
            maxHeight: maxRows ? `${maxRows * 24}px` : undefined,
          }}
          {...props}
        />
      </div>
      
      {showHelperText && (
        <div className="flex justify-between items-center">
          <p 
            className={cn(
              'text-xs',
              hasError ? 'text-destructive' : 'text-muted-foreground',
              disabled && 'text-muted-foreground/50'
            )}
          >
            {hasError ? errorMessage : helperText}
          </p>
          
          {maxLength !== undefined && charCount !== undefined && (
            <span 
              className={cn(
                'text-xs',
                charCount > maxLength ? 'text-destructive' : 'text-muted-foreground',
                disabled && 'text-muted-foreground/50'
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

SizedTextarea.displayName = 'SizedTextarea';

export { SizedTextarea };
export type { TextareaProps as SizedTextareaProps, TextareaSize as SizedTextareaSize };
