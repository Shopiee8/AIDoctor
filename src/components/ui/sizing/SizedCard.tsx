import React, { HTMLAttributes, forwardRef } from 'react';
import { componentSizes } from '@/lib/sizing-utils';
import { cn } from '@/lib/utils';

/**
 * Available card sizes
 */
export type CardSize = keyof typeof componentSizes.card;

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * The size of the card
   * @default 'md'
   */
  size?: CardSize;
  
  /**
   * If true, the card will have a subtle shadow
   * @default true
   */
  elevated?: boolean;
  
  /**
   * If true, the card will have a border
   * @default true
   */
  bordered?: boolean;
  
  /**
   * If true, the card will have rounded corners
   * @default true
   */
  rounded?: boolean;
  
  /**
   * The title of the card (optional)
   */
  title?: React.ReactNode;
  
  /**
   * The subtitle of the card (optional)
   */
  subtitle?: React.ReactNode;
  
  /**
   * The header actions (optional)
   */
  headerActions?: React.ReactNode;
  
  /**
   * The footer content (optional)
   */
  footer?: React.ReactNode;
}

/**
 * A card component with consistent sizing and styling.
 * Provides a flexible container for displaying content in a card format.
 */
const SizedCard = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  size = 'md',
  elevated = true,
  bordered = true,
  rounded = true,
  title,
  subtitle,
  headerActions,
  footer,
  ...props
}, ref) => {
  const sizeStyles = componentSizes.card[size];
  
  return (
    <div
      ref={ref}
      className={cn(
        'bg-card text-card-foreground overflow-hidden',
        'transition-all duration-200',
        {
          'shadow-sm': elevated,
          'border': bordered,
          'rounded-lg': rounded,
        },
        className
      )}
      style={{
        padding: sizeStyles.padding,
        borderRadius: sizeStyles.borderRadius,
      }}
      {...props}
    >
      {(title || subtitle || headerActions) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center space-x-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
      
      {footer && (
        <div className="mt-6 pt-4 border-t border-border">
          {footer}
        </div>
      )}
    </div>
  );
});

SizedCard.displayName = 'SizedCard';

export { SizedCard };
export type { CardProps as SizedCardProps };
