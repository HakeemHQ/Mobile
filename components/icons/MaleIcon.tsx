import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg"
import { IconProps } from './types';
import { resolveIconColor } from './utils';

export function MaleIcon({ size = 24, color, strokeWidth = 1.5, style, ...props }: IconProps) {
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
      <Circle cx={10} cy={14} r={5} />
      <Path d="M13.5 10.5L21 3" />
      <Path d="M16 3h5v5" />
    </Svg>
  )
}
