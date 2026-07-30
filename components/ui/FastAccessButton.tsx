import { Text, Pressable, View, StyleProp, ViewStyle } from 'react-native';
import { FastAccessButtonProps } from '@/types/ui';

export function FastAccessButton({ 
  title, 
  icon, 
  active, 
  width,
  height,
  activeBgColor = 'bg-primary-100',
  activeBorderColor = 'border-primary-900 border-[1px]',
  activeCircleColor = 'bg-primary-200',
  activeTextColor = 'text-primary-900',
  inactiveBgColor = 'bg-surface',
  inactiveBorderColor = 'border-border border-[1px]',
  inactiveCircleColor = 'bg-primary-50',
  inactiveTextColor = 'text-text',
  style, 
  ...props 
}: FastAccessButtonProps) {

  const containerStyle: StyleProp<ViewStyle> = {};
  if (width !== undefined) containerStyle.width = width;
  if (height !== undefined) containerStyle.height = height;

  return (
    <Pressable
      className={`active:opacity-80 flex-col items-center justify-center rounded-2xl p-4 gap-2 ${
        active ? `${activeBgColor} ${activeBorderColor}` : `${inactiveBgColor} ${inactiveBorderColor}`
      }`}
      style={
        typeof style === 'function'
          ? (state) => [containerStyle, style(state)]
          : [containerStyle, style]
      }
      {...props}
    >
      <View
        className={`w-12 h-12 rounded-full items-center justify-center ${
          active ? activeCircleColor : inactiveCircleColor
        }`}
      >
        {icon}
      </View>
      <Text
        className={`font-jakarta-bold text-[12px] text-center ${
          active ? activeTextColor : inactiveTextColor
        }`}
      >
        {title}
      </Text>
    </Pressable>
  );
}
