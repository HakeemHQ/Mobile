import { Text, View } from 'react-native';

import { colors } from '@/lib/theme/colors';
import {
    buildProfileDisplayName,
    getInitials,
} from '@/lib/profile-utils';
import type { ProfileData } from '@/types/profile';

interface ProfileSummaryCardProps {
    profile: ProfileData;
}

export function ProfileSummaryCard({
    profile,
}: ProfileSummaryCardProps) {
    const displayName = buildProfileDisplayName(profile);
    const initials = getInitials(displayName);

    return (
        <View className="mb-6 flex-row items-center rounded-[28px] bg-primary-900 p-5">
            <View className="mr-4 h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-primary-800">
                <Text className="font-jakarta-bold text-2xl text-surface">
                    {initials}
                </Text>
            </View>

            <View className="flex-1">
                <Text
                    className="font-jakarta-bold text-[17px] text-surface"
                    numberOfLines={1}
                >
                    {displayName}
                </Text>

                <Text
                    className="mt-1 font-inter-regular text-[11px] text-surface opacity-70"
                    ellipsizeMode="middle"
                    numberOfLines={1}
                >
                    ID: {profile.userId}
                </Text>

                <View
                    className="mt-2 self-start rounded-full border px-3 py-1.5"
                    style={{
                        backgroundColor: colors.primary[700],
                        borderColor: colors.primary[600],
                    }}
                >
                    <View className="flex-row items-center">
                        <View
                            className="mr-2 h-2 w-2 rounded-full"
                            style={{
                                backgroundColor: colors.primary[300],
                            }}
                        />

                        <Text className="font-jakarta-bold text-[9px] uppercase tracking-wide text-surface">
                            {profile.status || 'Unknown'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}