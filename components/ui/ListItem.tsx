import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowRight01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { ListItemProps } from '@/types/ui';
import { colors } from '@/lib/theme';

export function ListItem({
  title,
  body,
  leftIcon,
  rightIcon,
  showLeftIcon = true,
  showRightIcon = true,
  date,
  badge,
  selected = false,
  iconBgColor = 'bg-[#E8F8F0]',
  containerClassName,
  onPress,
  disabled,
  style,
  ...props
}: ListItemProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        'flex-row items-center p-4 rounded-2xl bg-white border border-[#E5E7EB] mb-3',
        isRTL && 'flex-row-reverse',
        selected && 'border-primary border-2 bg-primary-50/20',
        disabled && 'opacity-50',
        containerClassName
      )}
      style={({ pressed }) => [
        { opacity: pressed && !disabled ? 0.8 : 1 },
        style as any,
      ]}
      {...props}
    >
      {showLeftIcon && leftIcon && (
        <View className={cn('w-11 h-11 rounded-2xl items-center justify-center', isRTL ? 'ml-3' : 'mr-3', iconBgColor)}>
          {leftIcon}
        </View>
      )}

      <View className={cn('flex-1 justify-center', isRTL ? 'pl-2' : 'pr-2')}>
        <Text className={cn('text-[14px] font-jakarta-bold text-text-500 mb-0.5', isRTL && 'text-right')}>
          {title}
        </Text>
        {body ? (
          <Text className={cn('text-[14px] font-inter-regular text-text2-600 leading-4', isRTL && 'text-right')}>
            {body}
          </Text>
        ) : null}
        {date ? (
          <Text className={cn('text-[12px] font-jakarta-regular text-text2-400 mt-1', isRTL && 'text-right')}>
            {date}
          </Text>
        ) : null}
      </View>

      {badge ? (
        <View className={cn('px-2.5 py-1 rounded-full bg-[#E8F8F0]', isRTL ? 'ml-2' : 'mr-2')}>
          <Text className="text-[12px] font-jakarta-medium text-secondary-900">{badge}</Text>
        </View>
      ) : null}

      {showRightIcon ? (
        <View className={isRTL ? 'mr-1' : 'ml-1'}>
          {rightIcon || <HugeiconsIcon icon={isRTL ? ArrowLeft01Icon : ArrowRight01Icon} size={24} color={colors.primary[900]} />}
        </View>
      ) : null}
    </Pressable>
  );
}
