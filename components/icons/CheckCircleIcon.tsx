import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { IconProps } from './types';
import { resolveIconColor } from './utils';

export function CheckCircleIcon({
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
      <Path d="M9 12l2 2 4-4" stroke={activeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
