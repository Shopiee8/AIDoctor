import React, { CSSProperties, ReactNode } from 'react';
import { spacing } from '@/lib/sizing-utils';

/**
 * Type representing the available spacing sizes
 */
export type SpacingSize = keyof typeof spacing;

interface SizedBoxProps {
  /**
   * The content to render inside the box
   */
  children?: ReactNode;
  
  /**
   * Width of the box (in spacing units or CSS value)
   */
  width?: SpacingSize | string | number;
  
  /**
   * Height of the box (in spacing units or CSS value)
   */
  height?: SpacingSize | string | number;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Additional inline styles
   */
  style?: CSSProperties;
  
  /**
   * Padding on all sides (in spacing units or CSS value)
   */
  p?: SpacingSize | string | number;
  
  /**
   * Padding on the top (in spacing units or CSS value)
   */
  pt?: SpacingSize | string | number;
  
  /**
   * Padding on the right (in spacing units or CSS value)
   */
  pr?: SpacingSize | string | number;
  
  /**
   * Padding on the bottom (in spacing units or CSS value)
   */
  pb?: SpacingSize | string | number;
  
  /**
   * Padding on the left (in spacing units or CSS value)
   */
  pl?: SpacingSize | string | number;
  
  /**
   * Padding on the horizontal axis (in spacing units or CSS value)
   */
  px?: SpacingSize | string | number;
  
  /**
   * Padding on the vertical axis (in spacing units or CSS value)
   */
  py?: SpacingSize | string | number;
  
  /**
   * Margin on all sides (in spacing units or CSS value)
   */
  m?: SpacingSize | string | number;
  
  /**
   * Margin on the top (in spacing units or CSS value)
   */
  mt?: SpacingSize | string | number;
  
  /**
   * Margin on the right (in spacing units or CSS value)
   */
  mr?: SpacingSize | string | number;
  
  /**
   * Margin on the bottom (in spacing units or CSS value)
   */
  mb?: SpacingSize | string | number;
  
  /**
   * Margin on the left (in spacing units or CSS value)
   */
  ml?: SpacingSize | string | number;
  
  /**
   * Margin on the horizontal axis (in spacing units or CSS value)
   */
  mx?: SpacingSize | string | number;
  
  /**
   * Margin on the vertical axis (in spacing units or CSS value)
   */
  my?: SpacingSize | string | number;
}

/**
 * A utility component for consistent spacing and sizing throughout the application.
 * Helps maintain a consistent design system by using predefined spacing values.
 */
export const SizedBox: React.FC<SizedBoxProps> = ({
  children,
  width,
  height,
  className = '',
  style,
  p,
  pt,
  pr,
  pb,
  pl,
  px,
  py,
  m,
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  ...rest
}) => {
  const getSpacingValue = (value?: SpacingSize | string | number): string | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === 'number') return `${value}px`;
    if (typeof value === 'string' && value in spacing) {
      return spacing[value as SpacingSize];
    }
    return value as string;
  };

  const styles: React.CSSProperties = {
    ...style,
    width: getSpacingValue(width),
    height: getSpacingValue(height),
    padding: getSpacingValue(p),
    paddingTop: getSpacingValue(pt) || getSpacingValue(py) || getSpacingValue(p),
    paddingRight: getSpacingValue(pr) || getSpacingValue(px) || getSpacingValue(p),
    paddingBottom: getSpacingValue(pb) || getSpacingValue(py) || getSpacingValue(p),
    paddingLeft: getSpacingValue(pl) || getSpacingValue(px) || getSpacingValue(p),
    margin: getSpacingValue(m),
    marginTop: getSpacingValue(mt) || getSpacingValue(my) || getSpacingValue(m),
    marginRight: getSpacingValue(mr) || getSpacingValue(mx) || getSpacingValue(m),
    marginBottom: getSpacingValue(mb) || getSpacingValue(my) || getSpacingValue(m),
    marginLeft: getSpacingValue(ml) || getSpacingValue(mx) || getSpacingValue(m),
  };

  // Clean up undefined values to avoid React warnings
  Object.keys(styles).forEach(key => {
    if (styles[key as keyof typeof styles] === undefined) {
      delete styles[key as keyof typeof styles];
    }
  });

  return (
    <div className={className} style={styles} {...rest}>
      {children}
    </div>
  );
};

export default SizedBox;
