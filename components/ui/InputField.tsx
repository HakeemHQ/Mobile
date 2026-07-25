import { View, Text, TextInput, Pressable, TextInputProps } from 'react-native';
import React from 'react';

interface InputFieldProps extends TextInputProps {
  label: string;
  icon: any;
  rightIcon?: any;
  onRightIconPress?: () => void;
  error?: string;
  containerClassName?: string;
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
  containerClassName = "mb-4",
  ...props
}: InputFieldProps) {
  return (
    <View className={containerClassName}>
      <Text className="text-xs font-jakarta-medium text-text-500 mb-2">{label}</Text>
      <View className={`flex-row items-center bg-bg rounded-2xl px-4 h-14 ${error ? 'border border-red-500' : 'border border-transparent'}`}>
        <Icon size={20} color="text2.400" />
        <TextInput 
          className="flex-1 ml-3 text-base font-inter-regular text-text-500 placeholder:text-text2-400"
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          {...props}
        />
        {RightIcon && (
          <Pressable onPress={onRightIconPress} className="p-2 -mr-2">
            <RightIcon size={20} color="text2.400" />
          </Pressable>
        )}
      </View>
      {error ? (
        <Text className="text-xs font-inter-regular text-red-500 mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
