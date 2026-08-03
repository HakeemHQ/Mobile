import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Hourglass } from 'lucide-react-native';

interface ProcessingStepItemProps {
  label: string;
  stepIndex: number;
  currentStep: number;
  isRTL?: boolean;
}

export const ProcessingStepItem: React.FC<ProcessingStepItemProps> = ({
  label,
  stepIndex,
  currentStep,
  isRTL = false,
}) => {
  const isCompleted = stepIndex < currentStep;
  const isActive = stepIndex === currentStep;

  if (isActive) {
    return (
      <View
        className={`w-full ${
          isRTL ? 'flex-row-reverse' : 'flex-row'
        } items-center bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl px-4 py-3.5 mb-3`}
      >
        <View className="w-8 h-8 rounded-full bg-[#FEF3C7] items-center justify-center border border-[#FCD34D]">
          <Hourglass size={18} color="#D97706" />
        </View>
        <Text
          className={`flex-1 text-[15px] font-jakarta-bold text-[#92400E] ${
            isRTL ? 'mr-3 text-right' : 'ml-3 text-left'
          }`}
        >
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`w-full ${
        isRTL ? 'flex-row-reverse' : 'flex-row'
      } items-center px-4 py-3 mb-2`}
    >
      {isCompleted ? (
        <View className="w-8 h-8 rounded-full bg-[#059669] items-center justify-center">
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 6L9 17l-5-5"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      ) : (
        <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
          <View className="w-3 h-3 rounded-full bg-white" />
        </View>
      )}

      <Text
        className={`flex-1 text-[15px] ${
          isCompleted
            ? 'font-jakarta-semibold text-[#06432E]'
            : 'font-jakarta-medium text-gray-400'
        } ${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'}`}
      >
        {label}
      </Text>
    </View>
  );
};
