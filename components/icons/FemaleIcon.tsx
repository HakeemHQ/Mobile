import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

export function FemaleIcon(props: SvgProps) {
  return (
    <Svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Circle cx={12} cy={10} r={5} />
      <Path d="M12 15v7" />
      <Path d="M9 19h6" />
    </Svg>
  )
}
