import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { IconProps } from './types';
import { resolveIconColor } from './utils';

export function InfoCircleIcon({
  size = 24,
  color,
  strokeWidth = 1.5,
  style,
  ...props
}: IconProps) {
  const activeColor = resolveIconColor(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} {...props}>
      <Circle cx="12" cy="12" r="10" stroke={activeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 16v-4" stroke={activeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 8h.01" stroke={activeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
