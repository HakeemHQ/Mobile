import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';
import { resolveIconColor } from './utils';

export function ContainerIcon({
  size = 24,
  color,
  style,
  ...props
}: IconProps) {
  const activeColor = resolveIconColor(color);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} {...props}>
      <Path
        d="M6.16667 17.8333H7.35417L15.5 9.6875L14.3125 8.5L6.16667 16.6458V17.8333ZM4.5 19.5V15.9583L15.5 4.97917C15.6667 4.82639 15.8507 4.70833 16.0521 4.625C16.2535 4.54167 16.4653 4.5 16.6875 4.5C16.9097 4.5 17.125 4.54167 17.3333 4.625C17.5417 4.70833 17.7222 4.83333 17.875 5L19.0208 6.16667C19.1875 6.31944 19.309 6.5 19.3854 6.70833C19.4618 6.91667 19.5 7.125 19.5 7.33333C19.5 7.55556 19.4618 7.76736 19.3854 7.96875C19.309 8.17014 19.1875 8.35417 19.0208 8.52083L8.04167 19.5H4.5ZM17.8333 7.33333L16.6667 6.16667L17.8333 7.33333ZM14.8958 9.10417L14.3125 8.5L15.5 9.6875L14.8958 9.10417Z"
        fill={activeColor}
      />
    </Svg>
  );
}
