import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';
import { resolveIconColor } from './utils';

export function CheckmarkCircleIcon({
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
        d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
        stroke={activeColor}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M8 12.75C8 12.75 9.6 13.6625 10.4 15C10.4 15 12.8 9.75 16 8"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const CheckmarkCircle01Icon = CheckmarkCircleIcon;
