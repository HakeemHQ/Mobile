import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';
import { resolveIconColor } from './utils';

export function TimeIcon({
  size = 24,
  color,
  strokeWidth = 1.5,
  style,
  variant = 'outline',
  ...props
}: IconProps) {
  const activeColor = resolveIconColor(color);
  const innerLineStroke = variant === 'solid' ? '#FFFFFF' : activeColor;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      {/* Outer circle - fill + same-color stroke */}
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill={variant === 'solid' ? activeColor : 'none'}
        stroke={activeColor}
        strokeWidth={strokeWidth}
      />
      {/* Inner clock hands - white when solid, activeColor when outline */}
      <Path
        d="M12.0078 10.5082C11.1794 10.5082 10.5078 11.1798 10.5078 12.0082C10.5078 12.8366 11.1794 13.5082 12.0078 13.5082C12.8362 13.5082 13.5078 12.8366 13.5078 12.0082C13.5078 11.1798 12.8362 10.5082 12.0078 10.5082ZM12.0078 10.5082V6.99902M15.0147 15.0198L13.0661 13.0712"
        fill="none"
        stroke={innerLineStroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const Time02Icon = TimeIcon;
