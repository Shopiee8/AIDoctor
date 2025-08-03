import React from 'react';

/**
 * Typography scale values in rem units
 * Based on a base font size of 14px (0.875rem)
 */
export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  '6xl': '3.75rem', // 60px
} as const;

type FontSize = keyof typeof fontSizes;

/**
 * Font weights for consistent typography
 */
export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

type FontWeight = keyof typeof fontWeights;

/**
 * Line heights for consistent vertical rhythm
 */
export const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

type LineHeight = keyof typeof lineHeights;

/**
 * Letter spacing values for improved readability
 */
export const letterSpacings = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

type LetterSpacing = keyof typeof letterSpacings;

/**
 * Typography utility for consistent text styling
 * @param size - The font size from the typography scale
 * @param weight - The font weight
 * @param lineHeight - The line height
 * @param letterSpacing - The letter spacing
 * @returns CSS styles for typography
 */
export const textStyle = (
  size: FontSize = 'base',
  weight: FontWeight = 'normal',
  lineHeight: LineHeight = 'normal',
  letterSpacing: LetterSpacing = 'normal'
): React.CSSProperties => ({
  fontSize: fontSizes[size],
  fontWeight: fontWeights[weight],
  lineHeight: lineHeights[lineHeight],
  letterSpacing: letterSpacings[letterSpacing],
});

/**
 * Headline styles for consistent heading typography
 */
export const headlineStyles = {
  h1: {
    ...textStyle('4xl', 'bold', 'tight'),
    marginBottom: '1.5rem',
  },
  h2: {
    ...textStyle('3xl', 'semibold', 'tight'),
    marginBottom: '1.25rem',
  },
  h3: {
    ...textStyle('2xl', 'semibold', 'snug'),
    marginBottom: '1rem',
  },
  h4: {
    ...textStyle('xl', 'medium', 'snug'),
    marginBottom: '0.75rem',
  },
  h5: {
    ...textStyle('lg', 'medium', 'normal'),
    marginBottom: '0.5rem',
  },
  h6: {
    ...textStyle('base', 'medium', 'normal'),
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: letterSpacings.wide,
  },
} as const;

/**
 * Text style variants
 */
export const textStyles: Record<TextVariant, React.CSSProperties> = {
  // Display text
  displayLarge: {
    ...textStyle('5xl', 'bold', 'tight'),
    letterSpacing: '-0.02em',
  },
  displayMedium: {
    ...textStyle('4xl', 'bold', 'tight'),
    letterSpacing: '-0.02em',
  },
  displaySmall: {
    ...textStyle('3xl', 'bold', 'tight'),
    letterSpacing: '-0.02em',
  },
  
  // Headline text
  headlineLarge: textStyle('2xl', 'bold', 'tight'),
  headlineMedium: textStyle('xl', 'bold', 'tight'),
  headlineSmall: textStyle('lg', 'bold', 'tight'),
  
  // Title text
  titleLarge: textStyle('lg', 'bold', 'normal'),
  titleMedium: textStyle('base', 'bold', 'normal'),
  titleSmall: textStyle('sm', 'bold', 'normal'),
  
  // Body text
  bodyLarge: textStyle('lg', 'normal', 'normal'),
  body: textStyle('base', 'normal', 'normal'),
  bodySmall: textStyle('sm', 'normal', 'normal'),
  
  // Caption text
  caption: {
    ...textStyle('xs', 'normal', 'normal', 'wide'),
    display: 'inline-block',
    textTransform: 'uppercase',
  },
  
  // Helper text
  helper: {
    ...textStyle('xs', 'normal', 'normal'),
    display: 'block',
    color: 'var(--muted-foreground)',
  },
  
  // Overline text
  overline: {
    ...textStyle('xs', 'bold', 'normal', 'wide'),
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  
  // Button text
  buttonLarge: {
    ...textStyle('base', 'medium', 'normal'),
    letterSpacing: '0.01em',
    textTransform: 'none',
  },
  button: {
    ...textStyle('sm', 'medium', 'normal'),
    letterSpacing: '0.01em',
    textTransform: 'none',
  },
  buttonSmall: {
    ...textStyle('xs', 'medium', 'normal'),
    letterSpacing: '0.01em',
    textTransform: 'none',
  },
};

// Define text variant types first
type TextVariant = 
  | 'displayLarge' | 'displayMedium' | 'displaySmall'
  | 'headlineLarge' | 'headlineMedium' | 'headlineSmall'
  | 'titleLarge' | 'titleMedium' | 'titleSmall'
  | 'bodyLarge' | 'body' | 'bodySmall'
  | 'caption' | 'helper' | 'overline'
  | 'buttonLarge' | 'button' | 'buttonSmall';

/**
 * Text component props
 */
interface TextProps {
  /** The HTML element to render */
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  
  /** The text variant to apply */
  variant?: TextVariant;
  
  /** Additional CSS class name */
  className?: string;
  
  /** Children nodes */
  children: React.ReactNode;
  
  /** Additional styles */
  style?: React.CSSProperties;
}

/**
 * A text component with consistent typography styles
 */
export const Text: React.FC<TextProps> = ({
  as: Tag = 'p',
  variant = 'body',
  className = '',
  children,
  style,
  ...props
}) => {
  // Get the appropriate styles for the variant
  const variantStyle = textStyles[variant] || '';
  
  return React.createElement(
    Tag,
    {
      className: `${variantStyle} ${className}`.trim(),
      style,
      ...props
    },
    children
  );
};

// Export types
export type { FontSize, FontWeight, LineHeight, LetterSpacing, TextVariant, TextProps };
