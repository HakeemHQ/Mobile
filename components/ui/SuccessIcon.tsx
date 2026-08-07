import {
    View,
} from 'react-native';

import {
    Check,
} from 'lucide-react-native';

import {
    colors,
} from '@/lib/theme/colors';

const sparkles = [
    {
        top: 8,
        left: 14,
        size: 5,
        backgroundColor: '#FACC15',
    },
    {
        top: 2,
        right: 22,
        size: 5,
        backgroundColor: '#EF4444',
    },
    {
        top: 42,
        right: 0,
        size: 5,
        backgroundColor: '#F97316',
    },
    {
        bottom: 42,
        right: 6,
        size: 5,
        backgroundColor: '#6366F1',
    },
    {
        bottom: 8,
        right: 28,
        size: 5,
        backgroundColor: '#D946EF',
    },
    {
        bottom: 10,
        left: 20,
        size: 5,
        backgroundColor: '#14B8A6',
    },
    {
        top: 58,
        left: 0,
        size: 5,
        backgroundColor: '#EF4444',
    },
];

export function SuccessIcon() {
    return (
        <View className="relative h-44 w-44 items-center justify-center">
            {sparkles.map(
                (
                    {
                        size,
                        backgroundColor,
                        ...position
                    },
                    index,
                ) => (
                    <View
                        key={index}
                        className="absolute rounded-full"
                        style={{
                            width: size,
                            height: size,
                            backgroundColor,
                            ...position,
                        }}
                    />
                ),
            )}

            <View
                className="h-36 w-36 items-center justify-center rounded-full"
                style={{
                    backgroundColor:
                        colors.secondary[600],
                }}
            >
                <Check
                    size={72}
                    color={
                        colors.surface
                            .DEFAULT
                    }
                    strokeWidth={3}
                />
            </View>
        </View>
    );
}