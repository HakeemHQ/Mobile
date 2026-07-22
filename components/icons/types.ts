import { StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { colors } from '@/lib/theme/colors';

type ColorGroup = keyof typeof colors;

export type IconColorProp =
  | ColorGroup
  | `${ColorGroup}.${string}`
  | `${ColorGroup}-${string}`
  | (string & {});

export interface IconProps extends Omit<SvgProps, 'color' | 'width' | 'height'> {
  /** Size in pixels (applies to width & height). Default: 24 */
  size?: number | string;

  /** Color token from theme (e.g. 'primary', 'secondary', 'text', 'primary.500') or custom color (e.g. '#1A56DB') */
  color?: IconColorProp;

  /** Width of line strokes. Default: 1.5 */
  strokeWidth?: number | string;

  /** Optional NativeWind className */
  className?: string;

  /** Style object */
  style?: StyleProp<ViewStyle>;

  /** Variant of the icon, useful for active tabs */
  variant?: 'outline' | 'solid';
}

export type IconName =
  | 'add'
  | 'add-02'
  | 'alert'
  | 'alert-01'
  | 'alert-square'
  | 'arrow-left-01'
  | 'arrow-left-02'
  | 'arrow-left-big'
  | 'arrow-right'
  | 'arrow-right-01'
  | 'arrow-right-big'
  | 'calendar'
  | 'calendar-03'
  | 'call'
  | 'call-02'
  | 'checkmark-circle'
  | 'checkmark-circle-01'
  | 'container'
  | 'delete'
  | 'delete-02'
  | 'eye-off'
  | 'file'
  | 'file-02'
  | 'files'
  | 'files-01'
  | 'home'
  | 'home-03'
  | 'lock-open'
  | 'mail'
  | 'mail-01'
  | 'notification'
  | 'notification-01'
  | 'security-check'
  | 'shield'
  | 'stethoscope'
  | 'stethoscope-02'
  | 'time'
  | 'time-02'
  | 'user'
  | 'user-02'
  | 'view';
