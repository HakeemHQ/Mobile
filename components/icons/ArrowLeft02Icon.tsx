import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';
import { resolveIconColor } from './utils';

export function ArrowLeft02Icon({
  size = 24,
  color,
  strokeWidth = 1.5,
  style,
  ...props
}: IconProps) {
  const activeColor = resolveIconColor(color);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} {...props}>
      <Path
        d="M5.5 12.002H19"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.9999 18.002C10.9999 18.002 5.00001 13.583 5 12.0019C4.99999 10.4208 11 6.00195 11 6.00195"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
