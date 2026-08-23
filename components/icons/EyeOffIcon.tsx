import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';
import { resolveIconColor } from './utils';

export function EyeOffIcon({
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
        d="M6.43385 6.51953C4.22009 7.89049 2.93281 9.86457 2.31858 11.0339C2.10621 11.4382 2.00003 11.6403 2 12.0082C1.99997 12.3761 2.10584 12.5777 2.3176 12.981C3.32862 14.9066 6.16702 19.0195 11.9669 19.0195C14.2454 19.0195 16.0669 18.3848 17.5 17.4972"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.87868 9.87891C9.33579 10.4218 9 11.1718 9 12.0002C9 13.6571 10.3431 15.0002 12 15.0002C12.8284 15.0002 13.5784 14.6644 14.1213 14.1215"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M2 2L22 22"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 5.14847C10.5934 5.05255 11.224 5 11.8936 5C17.7747 5 20.6528 9.05385 21.6779 10.9517C21.8927 11.3492 22 11.548 22 11.9106C22 12.2733 21.8921 12.4727 21.6765 12.8717C21.3678 13.4428 20.8916 14.2085 20.2167 15"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
