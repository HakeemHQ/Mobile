import { PressableProps, DimensionValue, StyleProp, ViewStyle } from 'react-native';

export interface FastAccessButtonProps extends PressableProps {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  
  width?: DimensionValue;
  height?: DimensionValue;

  activeBgColor?: string;
  activeBorderColor?: string;
  activeCircleColor?: string;
  activeTextColor?: string;

  inactiveBgColor?: string;
  inactiveBorderColor?: string;
  inactiveCircleColor?: string;
  inactiveTextColor?: string;
}

export interface ButtonProps extends PressableProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'disabled' | null;
  size?: 'default' | 'auto' | null;
}

export interface InfoBannerProps {
  text: string;
  icon?: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export interface ListItemProps extends PressableProps {
  title: string;
  body?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  date?: string;
  badge?: string;
  selected?: boolean;
  iconBgColor?: string;
  containerClassName?: string;
}

export interface ConfirmDetailsModalProps {
  visible: boolean;
  imageUri: string | null;
  fileName?: string | null;
  documentTitle: string;
  documentDate: string;
  onConfirm: () => void;
  onBackToEdit: () => void;
}
