import { colors } from '@/lib/theme/colors';

/**
 * Resolves color token names (e.g. 'primary', 'secondary', 'primary.500', 'text')
 * to actual hex/color values from theme colors.
 * Returns custom color strings as-is.
 */
export function resolveIconColor(color?: string, fallbackColor: string = '#141B34'): string {
  if (!color) return fallbackColor;

  // Split on dot or hyphen (e.g. 'primary.500' or 'primary-500')
  const parts = color.includes('.')
    ? color.split('.')
    : color.includes('-') && !color.startsWith('#')
      ? color.split('-')
      : [color];

  const groupKey = parts[0] as keyof typeof colors;

  if (groupKey in colors) {
    const groupObj = colors[groupKey];
    if (typeof groupObj === 'object' && groupObj !== null) {
      if (parts.length > 1) {
        const shade = parts[1];
        if (shade in groupObj) {
          return (groupObj as Record<string, string>)[shade];
        }
      }
      if ('DEFAULT' in groupObj) {
        return groupObj.DEFAULT;
      }
    }
  }

  return color;
}
