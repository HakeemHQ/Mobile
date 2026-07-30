import { Text, Pressable, View, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types/ui';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-2xl h-[46px] px-4 relative overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        outline: 'bg-transparent border border-primary',
        disabled: 'bg-[#9CA3AF]',
      },
      size: {
        default: 'w-full',
        auto: 'self-start',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

const textVariants = cva(
  'font-jakarta-semibold text-[16px] text-center',
  {
    variants: {
      variant: {
        primary: 'text-white',
        secondary: 'text-white',
        outline: 'text-primary',
        disabled: 'text-white',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);


export function Button({
  title,
  variant,
  size,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentVariant = disabled ? 'disabled' : variant;

  return (
    <Pressable
      className={cn(buttonVariants({ variant: currentVariant, size }), className)}
      disabled={disabled}
      style={({ pressed }) => [
        props.style as StyleProp<ViewStyle>,
        { opacity: pressed && !disabled ? 0.8 : 1 }
      ]}
      {...props}
    >
      {leftIcon && <View className={cn("absolute z-10", isRTL ? "right-4" : "left-4")}>{leftIcon}</View>}
      <Text className={cn(textVariants({ variant: currentVariant }))}>
        {title}
      </Text>
      {rightIcon && <View className={cn("absolute z-10", isRTL ? "left-4" : "right-4")}>{rightIcon}</View>}
    </Pressable>
  );
}
