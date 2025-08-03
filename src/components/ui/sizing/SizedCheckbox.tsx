import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { componentSizes } from '@/lib/sizing-utils';

/**
 * Available checkbox sizes
 */
export type CheckboxSize = keyof typeof componentSizes.checkbox;

interface CheckboxProps 
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /**
   * The size of the checkbox
   * @default 'md'
   */
  checkboxSize?: CheckboxSize;
  
  /**
   * The label text to display next to the checkbox
   */
  label?: string;
  
  /**
   * The helper text to display below the checkbox
   */
  helperText?: string;
  
  /**
   * If true, the checkbox will show an error state
   * @default false
   */
  error?: boolean;
  
  /**
   * The error message to display below the checkbox
   */
  errorMessage?: string;
  
  /**
   * Additional class name for the container
   */
  containerClassName?: string;
}

/**
 * A checkbox component with consistent sizing and styling.
 * Built on top of Radix UI's Checkbox primitive.
 */
const SizedCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ 
  className, 
  checkboxSize = 'md',
  label,
  helperText,
  error = false,
  errorMessage,
  containerClassName,
  ...props 
}, ref) => {
  const sizeStyles = componentSizes.checkbox[checkboxSize];
  const hasError = error || !!errorMessage;
  const showHelperText = hasError || helperText;
  const id = React.useId();
  
  return (
    <div className={cn('flex flex-col space-y-1', containerClassName)}>
      <div className="flex items-center space-x-2">
        <CheckboxPrimitive.Root
          ref={ref}
          className={cn(
            'peer shrink-0 rounded-sm border border-primary ring-offset-background',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
            'transition-colors duration-200',
            hasError && 'border-destructive',
            className
          )}
          style={{
            width: sizeStyles.size,
            height: sizeStyles.size,
          }}
          id={id}
          {...props}
        >
          <CheckboxPrimitive.Indicator
            className={cn("flex items-center justify-center text-current")}
          >
            <Check 
              className="h-full w-full" 
              style={{
                width: sizeStyles.iconSize,
                height: sizeStyles.iconSize,
              }} 
            />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'text-sm font-medium leading-none',
              'cursor-pointer',
              'select-none',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              hasError ? 'text-destructive' : 'text-foreground'
            )}
          >
            {label}
          </label>
        )}
      </div>
      
      {showHelperText && (
        <p 
          className={cn(
            'text-xs',
            hasError ? 'text-destructive' : 'text-muted-foreground',
            props.disabled && 'opacity-70'
          )}
        >
          {hasError ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
});

SizedCheckbox.displayName = 'SizedCheckbox';

export { SizedCheckbox };
export type { CheckboxProps as SizedCheckboxProps, CheckboxSize as SizedCheckboxSize };
