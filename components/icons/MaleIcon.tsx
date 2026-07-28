import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

export function MaleIcon(props: SvgProps) {
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
      <Circle cx={10} cy={14} r={5} />
      <Path d="M13.5 10.5L21 3" />
      <Path d="M16 3h5v5" />
    </Svg>
  )
}
