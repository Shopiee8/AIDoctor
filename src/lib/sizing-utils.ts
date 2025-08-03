/**
 * Sizing utilities for consistent component dimensions
 * These values are designed to work with the reduced global font size (14px base)
 */

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  base: '1rem',     // 16px
  lg: '1.25rem',    // 20px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
} as const;

export const borderRadius = {
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const;

export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
} as const;

export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

export const iconSizes = {
  xs: '0.75rem',    // 12px
  sm: '1rem',       // 16px
  md: '1.25rem',    // 20px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
} as const;

/**
 * Common component sizes
 */
export const componentSizes = {
  button: {
    sm: {
      height: '1.75rem',  // 28px
      padding: '0.375rem 0.75rem',
      fontSize: '0.75rem',
    },
    md: {
      height: '2.25rem',  // 36px
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
    },
    lg: {
      height: '2.75rem',  // 44px
      padding: '0.625rem 1.25rem',
      fontSize: '1rem',
    },
  },
  input: {
    sm: {
      height: '1.75rem',  // 28px
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
    },
    md: {
      height: '2.25rem',  // 36px
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
    },
    lg: {
      height: '2.75rem',  // 44px
      padding: '0.625rem 1rem',
      fontSize: '1rem',
    },
  },
  card: {
    sm: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
    },
    md: {
      padding: '1rem',
      borderRadius: '0.75rem',
    },
    lg: {
      padding: '1.5rem',
      borderRadius: '1rem',
    },
  },
  avatar: {
    xs: '1.25rem',  // 20px
    sm: '1.5rem',   // 24px
    md: '2rem',     // 32px
    lg: '3rem',     // 48px
    xl: '4rem',     // 64px
  },
  radio: {
    sm: {
      radio: '0.875rem',
      indicator: '0.5rem',
      label: '0.75rem',
      gap: '0.5rem',
    },
    md: {
      radio: '1rem',
      indicator: '0.625rem',
      label: '0.875rem',
      gap: '0.625rem',
    },
    lg: {
      radio: '1.25rem',
      indicator: '0.75rem',
      label: '1rem',
      gap: '0.75rem',
    },
  },
  select: {
    sm: {
      height: '1.75rem',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      iconSize: '1rem',
    },
    md: {
      height: '2.25rem',
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      iconSize: '1.25rem',
    },
    lg: {
      height: '2.75rem',
      padding: '0.625rem 1rem',
      fontSize: '1rem',
      iconSize: '1.5rem',
    },
  },
  checkbox: {
    sm: {
      size: '0.875rem',
      iconSize: '0.5rem',
      label: '0.75rem',
      gap: '0.5rem',
    },
    md: {
      size: '1rem',
      iconSize: '0.625rem',
      label: '0.875rem',
      gap: '0.625rem',
    },
    lg: {
      size: '1.25rem',
      iconSize: '0.75rem',
      label: '1rem',
      gap: '0.75rem',
    },
  },
  textarea: {
    sm: {
      minHeight: '5rem',
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      borderRadius: '0.375rem',
    },
    md: {
      minHeight: '7.5rem',
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      lineHeight: '1.5rem',
      borderRadius: '0.5rem',
    },
    lg: {
      minHeight: '10rem',
      padding: '1rem 1.25rem',
      fontSize: '1.125rem',
      lineHeight: '1.75rem',
      borderRadius: '0.75rem',
    },
  },
} as const;

/**
 * Responsive breakpoints
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Get responsive font size based on viewport width
 */
export function getResponsiveFontSize(minVw: number, maxVw: number, minFontSize: number, maxFontSize: number): string {
  return `
    font-size: ${minFontSize}px;
    
    @media (min-width: ${minVw}px) {
      font-size: calc(${minFontSize}px + (${maxFontSize} - ${minFontSize}) * ((100vw - ${minVw}px) / (${maxVw} - ${minVw})));
    }
    
    @media (min-width: ${maxVw}px) {
      font-size: ${maxFontSize}px;
    }
  `;
}
