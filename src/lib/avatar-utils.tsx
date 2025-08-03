import React from "react";
import { cn } from "@/lib/utils";

// Generate initials from a name
export const getInitials = (name: string): string => {
  if (!name) return "AI";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Generate a consistent color based on the name
export const getAvatarColor = (name: string): string => {
  const colors = [
    "4f46e5", // indigo-600
    "2563eb", // blue-600
    "059669", // emerald-600
    "7c3aed", // violet-600
    "c026d3", // fuchsia-600
    "dc2626", // red-600
    "ea580c", // orange-600
    "65a30d", // lime-600
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Get avatar URL
export const getAvatarUrl = (
  avatar: string | null | undefined,
  name: string
): string => {
  if (avatar) return avatar;

  const initials = getInitials(name);
  const color = getAvatarColor(name);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='#${color}'/><text x='50%' y='50%' font-size='50' text-anchor='middle' dy='.35em' fill='white' font-family='sans-serif' font-weight='500'>${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Avatar Props
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

// Avatar component
export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  className,
  ...props
}) => {
  const sizeClasses: Record<string, string> = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-24 h-24 text-3xl",
  };

  const [imgSrc, setImgSrc] = React.useState<string | undefined>(src || undefined);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
    setImgSrc(src || undefined);
  }, [src]);

  const handleError = () => {
    setHasError(true);
    setImgSrc(undefined);
  };

  const avatarUrl = React.useMemo(() => {
    return hasError || !imgSrc ? getAvatarUrl(null, name) : imgSrc;
  }, [hasError, imgSrc, name]);

  const isSvg = avatarUrl?.startsWith("data:image/svg+xml");

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full overflow-hidden",
        !isSvg && "bg-gray-100 dark:bg-gray-800",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <img
        src={avatarUrl}
        alt={name}
        className="w-full h-full object-cover"
        onError={handleError}
      />
    </div>
  );
};
