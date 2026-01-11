import type { SVGProps } from 'react';

export type IconPack = 'basic' | 'filled' | 'brands';

export type FlipDirection = 'horizontal' | 'vertical';

export type IconSize = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

export interface BoxIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /**
   * The icon pack to use: 'basic', 'filled', or 'brands'
   * @default 'basic' for regular icons, 'brands' for brand icons
   */
  pack?: IconPack;
  
  /**
   * SVG fill color
   */
  fill?: string;
  
  /**
   * SVG opacity (0-1)
   */
  opacity?: number | string;
  
  /**
   * Width of the icon
   * @default 24
   */
  width?: number | string;
  
  /**
   * Height of the icon
   * @default 24
   */
  height?: number | string;
  
  /**
   * Preset size for the icon. Only applied if width/height are not set.
   * xs=16, sm=20, base=24, md=36, lg=48, xl=64, 2xl=96, 3xl=128, 4xl=256, 5xl=512
   * @default 'base'
   */
  size?: IconSize;
  
  /**
   * Flip the icon horizontally or vertically
   */
  flip?: FlipDirection;
  
  /**
   * Rotate the icon by specified degrees
   */
  rotate?: number | string;
  
  /**
   * Additional CSS class name
   */
  className?: string;
  
  /**
   * Inline styles
   */
  style?: React.CSSProperties;
}

/**
 * Configuration for icon generation
 */
export interface IconConfig {
  /** Component name (PascalCase) */
  name: string;
  /** Available packs for this icon */
  packs: IconPack[];
  /** Default pack (first available) */
  defaultPack: IconPack;
  /** Whether this is a brand icon (brands only) */
  isBrandOnly: boolean;
}
