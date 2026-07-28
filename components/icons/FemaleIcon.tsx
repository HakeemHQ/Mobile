import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg"
import { IconProps } from './types';
import { resolveIconColor } from './utils';

export function FemaleIcon({ size = 24, color, strokeWidth = 1.5, style, ...props }: IconProps) {
  const activeColor = resolveIconColor(color);
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={activeColor || "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      {...props}
    >
      <Circle cx={12} cy={10} r={5} />
      <Path d="M12 15v7" />
      <Path d="M9 19h6" />
    </Svg>
  )
}
