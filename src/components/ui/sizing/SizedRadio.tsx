import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { componentSizes } from '@/lib/sizing-utils';

/**
 * Available radio button sizes
 */
export type RadioSize = keyof typeof componentSizes.radio;

export interface RadioItemProps 
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  /**
   * The size of the radio button
   * @default 'md'
   */
  radioSize?: RadioSize;
  
  /**
   * The label text to display next to the radio button
   */
  label?: string;
  
  /**
   * The helper text to display below the radio button
   */
  helperText?: string;
  
  /**
   * If true, the radio button will show an error state
   * @default false
   */
  error?: boolean;
  
  /**
   * The error message to display below the radio button
   */
  errorMessage?: string;
  
  /**
   * Additional class name for the container
   */
  containerClassName?: string;
}

/**
 * A radio button component with consistent sizing and styling.
 * Built on top of Radix UI's Radio Group primitive.
 */
const SizedRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioItemProps
>(({ 
  className, 
  radioSize = 'md',
  label,
  helperText,
  error = false,
  errorMessage,
  containerClassName,
  ...props 
}, ref) => {
  const sizeStyles = componentSizes.radio[radioSize];
  const radioSizePx = sizeStyles.radio;
  const hasError = error || !!errorMessage;
  const showHelperText = hasError || helperText;
  const id = React.useId();
  
  return (
    <div className={cn('flex flex-col space-y-1', containerClassName)}>
      <div className="flex items-center space-x-2">
        <RadioGroupPrimitive.Item
          ref={ref}
          className={cn(
            'aspect-square rounded-full border border-primary text-primary',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-200',
            'flex items-center justify-center',
            hasError && 'border-destructive',
            className
          )}
          style={{
            width: radioSizePx,
            height: radioSizePx,
          }}
          id={id}
          {...props}
        >
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <Circle 
              className={cn(
                'fill-current text-current',
                sizeStyles.indicator
              )} 
              style={{
                width: sizeStyles.indicator,
                height: sizeStyles.indicator,
              }}
            />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
        
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'font-medium leading-none',
              'cursor-pointer',
              'select-none',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              hasError ? 'text-destructive' : 'text-foreground',
              `text-[${sizeStyles.label}]`
            )}
            style={{
              fontSize: sizeStyles.label,
              marginLeft: sizeStyles.gap,
            }}
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

SizedRadioItem.displayName = 'SizedRadioItem';

export interface RadioGroupProps 
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /**
   * The size of the radio buttons in the group
   * @default 'md'
   */
  radioSize?: RadioSize;
  
  /**
   * The label for the radio group
   */
  label?: string;
  
  /**
   * The helper text to display below the radio group
   */
  helperText?: string;
  
  /**
   * If true, the radio group will show an error state
   * @default false
   */
  error?: boolean;
  
  /**
   * The error message to display below the radio group
   */
  errorMessage?: string;
  
  /**
   * The orientation of the radio group
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * The gap between radio items
   * @default 'md'
   */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * A radio group component with consistent sizing and styling.
 * Wraps Radix UI's Radio Group primitive.
 */
const SizedRadioGroup = ({
  className,
  radioSize = 'md',
  label,
  helperText,
  error = false,
  errorMessage,
  orientation = 'vertical',
  gap = 'md',
  children,
  ...props
}: RadioGroupProps) => {
  const hasError = error || !!errorMessage;
  const showHelperText = hasError || helperText;
  const id = React.useId();
  
  const gapClasses = {
    none: 'space-y-0',
    sm: orientation === 'vertical' ? 'space-y-2' : 'space-x-2',
    md: orientation === 'vertical' ? 'space-y-3' : 'space-x-4',
    lg: orientation === 'vertical' ? 'space-y-4' : 'space-x-6',
    xl: orientation === 'vertical' ? 'space-y-6' : 'space-x-8',
  };
  
  return (
    <div className={cn('flex flex-col space-y-2', className)}>
      {label && (
        <label 
          className={cn(
            'text-sm font-medium',
            hasError ? 'text-destructive' : 'text-foreground',
            props.disabled && 'opacity-70'
          )}
          htmlFor={id}
        >
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <RadioGroupPrimitive.Root
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          orientation === 'vertical' ? 'items-start' : 'items-center',
          gapClasses[gap],
          { 'opacity-70': props.disabled }
        )}
        aria-invalid={hasError}
        aria-errormessage={hasError ? `${id}-error` : undefined}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SizedRadioItem) {
            return React.cloneElement(child, { radioSize } as any);
          }
          return child;
        })}
      </RadioGroupPrimitive.Root>
      
      {showHelperText && (
        <p 
          id={`${id}-error`}
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
};

SizedRadioGroup.displayName = 'SizedRadioGroup';

const SizedRadio = {
  Group: SizedRadioGroup,
  Item: SizedRadioItem,
};

export { SizedRadio };
export type { 
  RadioItemProps as SizedRadioItemProps, 
  RadioGroupProps as SizedRadioGroupProps, 
  RadioSize as SizedRadioSize 
};
