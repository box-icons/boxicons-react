import type { FlipDirection, IconSize } from './types';

/**
 * Size to pixel mapping
 */
const SIZE_MAP: Record<IconSize, number> = {
  'xs': 16,
  'sm': 20,
  'base': 24,
  'md': 36,
  'lg': 48,
  'xl': 64,
  '2xl': 96,
  '3xl': 128,
  '4xl': 256,
  '5xl': 512,
};

/**
 * Get pixel value from size preset
 */
export function getSizePixels(size: IconSize): number {
  return SIZE_MAP[size] ?? SIZE_MAP['base'];
}

/**
 * Build transform attribute string from flip and rotate props
 */
export function buildTransform(
  flip?: FlipDirection,
  rotate?: number | string
): string | undefined {
  const transforms: string[] = [];

  if (flip === 'horizontal') {
    transforms.push('scale(-1,1)');
  } else if (flip === 'vertical') {
    transforms.push('scale(1,-1)');
  }

  if (rotate !== undefined) {
    const degrees = typeof rotate === 'string' 
      ? parseFloat(rotate.replace('deg', '')) 
      : rotate;
    transforms.push(`rotate(${degrees})`);
  }

  return transforms.length > 0 ? transforms.join(' ') : undefined;
}

/**
 * Merge SVG props with defaults
 */
export function mergeProps(
  defaultProps: Record<string, unknown>,
  userProps: Record<string, unknown>
): Record<string, unknown> {
  const merged = { ...defaultProps };
  
  for (const [key, value] of Object.entries(userProps)) {
    if (value !== undefined) {
      merged[key] = value;
    }
  }
  
  return merged;
}
