import React, { forwardRef, SelectHTMLAttributes } from 'react';
import { componentSizes } from '@/lib/sizing-utils';
import { cn } from '@/lib/utils';

/**
 * Available select input sizes
 */
export type SelectSize = keyof typeof componentSizes.select;

/**
 * Select option type
 */
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * The size of the select input
   * @default 'md'
   */
  selectSize?: SelectSize;
  
  /**
   * The options to display in the select dropdown
   */
  options: SelectOption[];
  
  /**
   * The currently selected value
   */
  value?: string | number;
  
  /**
   * The default value if no value is selected
   */
  defaultValue?: string | number;
  
  /**
   * Callback when the selected value changes
   */
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  
  /**
   * If true, the select will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * If true, the select will show an error state
   * @default false
   */
  error?: boolean;
  
  /**
   * The error message to display below the select
   */
  errorMessage?: string;
  
  /**
   * The label text to display above the select
   */
  label?: string;
  
  /**
   * The helper text to display below the select
   */
  helperText?: string;
  
  /**
   * The placeholder text to display when no option is selected
   */
  placeholder?: string;
  
  /**
   * If true, the select will be disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * If true, the select will be required
   * @default false
   */
  required?: boolean;
}

/**
 * A select dropdown component with consistent sizing and styling.
 * Provides a styled select dropdown with optional label, helper text, and error states.
 */
const SizedSelect = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  selectSize = 'md',
  options,
  value,
  defaultValue,
  onChange,
  fullWidth = false,
  error = false,
  errorMessage,
  label,
  helperText,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const sizeStyles = componentSizes.select[selectSize];
  const hasError = error || !!errorMessage;
  const showHelperText = hasError || helperText;
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      // Call the onChange handler with the event object
      onChange(e);
    }
  };
  
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
        <select
          ref={ref}
          className={cn(
            'flex w-full bg-background text-foreground',
            'border border-input ring-offset-background',
            'placeholder:text-muted-foreground/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-200',
            'appearance-none',
            'pr-8', // Make room for the dropdown icon
            hasError 
              ? 'border-destructive focus-visible:ring-destructive/30' 
              : 'focus:border-primary',
            { height: sizeStyles.height },
            { padding: sizeStyles.padding },
            { fontSize: sizeStyles.fontSize },
            className
          )}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          style={{
            minHeight: sizeStyles.height,
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled={!value && !defaultValue}>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Dropdown icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="h-4 w-4 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
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

SizedSelect.displayName = 'SizedSelect';

export { SizedSelect };
export type { SelectProps as SizedSelectProps, SelectSize as SizedSelectSize, SelectOption as SelectOptionType };
