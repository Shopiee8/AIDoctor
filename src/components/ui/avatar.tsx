"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  fallbackText?: string;
  showFallbackOnError?: boolean;
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, fallbackText, showFallbackOnError = true, ...props }, ref) => {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Reset error state when src changes
  React.useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [props.src]);

  // Show fallback if we're not showing fallback on error or if there's no src
  const shouldShowFallback = !props.src || (hasError && showFallbackOnError);

  // Get initials from fallback text
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .trim()
      .split(/\s+/)
      .map(part => part[0]?.toUpperCase() || '')
      .join('')
      .substring(0, 2);
  };

  if (shouldShowFallback) {
    return (
      <div className={cn(
        "flex items-center justify-center h-full w-full rounded-full bg-muted text-muted-foreground font-medium",
        className
      )}>
        {fallbackText ? getInitials(fallbackText) : 'U'}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/50 border-t-primary" />
        </div>
      )}
      <AvatarPrimitive.Image
        ref={ref}
        className={cn(
          "aspect-square h-full w-full object-cover",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        {...props}
      />
    </>
  );
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
