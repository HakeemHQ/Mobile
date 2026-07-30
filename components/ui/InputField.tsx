
import { View, Text, TextInput, Pressable, TextInputProps } from 'react-native';
import { useTranslation } from 'react-i18next';

interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  rightIcon?: any;
  onRightIconPress?: () => void;
  error?: string;
  containerClassName?: string;
  bgClassName?: string;
}

export function InputField({
  label,
  icon: Icon,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  rightIcon: RightIcon,
  onRightIconPress,
  error,
  containerClassName = 'mb-4',
  bgClassName = 'bg-secondary-50',
  ...props
}: InputFieldProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <View className={containerClassName}>
      <Text className={`text-xs font-jakarta-medium text-bg-800 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{label}</Text>
      <View
        className={`${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center ${bgClassName} rounded-2xl px-4 h-14 ${
          error ? 'border border-red-500' : 'border border-transparent'
        }`}
      >
        {Icon ? (
          typeof Icon === 'function' ? (
            <Icon size={20} color="#838994" />
          ) : (
            Icon
          )
        ) : null}
        <TextInput
          className={`flex-1 text-base font-inter-regular text-text-500 placeholder:text-text2-400 ${
            isRTL ? 'text-right' : 'text-left'
          } ${Icon ? (isRTL ? 'mr-3' : 'ml-3') : 'ml-0'}`}
          placeholder={placeholder}
          placeholderTextColor="#838994"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          {...props}
        />
        {RightIcon ? (
          <Pressable onPress={onRightIconPress} className={`p-2 ${isRTL ? '-ml-2' : '-mr-2'}`}>
            {typeof RightIcon === 'function' ? (
              <RightIcon size={20} color="#838994" />
            ) : (
              RightIcon
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className={`text-xs font-inter-regular text-red-500 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{error}</Text>
      ) : null}
    </View>
  );
}
