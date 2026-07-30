import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { InfoBannerProps } from '@/types/ui';

export function InfoBanner({
  text,
  icon,
  bgColor = 'rgba(188, 235, 220, 0.39)',
  borderColor = 'rgba(192, 201, 194, 0.30)',
  textColor = 'text-secondary-900',
  className = '',
  style,
  ...props
}: InfoBannerProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const isBgClass = bgColor.startsWith('bg-');
  const isBorderClass = borderColor.startsWith('border-');
  const isTextClass = textColor.startsWith('text-');

  const containerStyle: ViewStyle = {
    backgroundColor: !isBgClass ? bgColor : undefined,
    borderColor: !isBorderClass ? borderColor : undefined,
  };

  const textStyle: TextStyle = {
    color: !isTextClass ? textColor : undefined,
  };

  return (
    <View
      className={`p-4 rounded-2xl ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center gap-3 border ${
        isBgClass ? bgColor : ''
      } ${isBorderClass ? borderColor : ''} ${className}`}
      style={[containerStyle, style]}
      {...props}
    >
      {icon && <View>{icon}</View>}
      <Text
        className={`flex-1 text-[13px] font-jakarta-medium leading-5 ${isRTL ? 'text-right' : 'text-left'} ${
          isTextClass ? textColor : ''
        }`}
        style={textStyle}
      >
        {text}
      </Text>
    </View>
  );
}
