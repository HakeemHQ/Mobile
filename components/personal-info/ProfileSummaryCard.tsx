import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ShieldAlert } from 'lucide-react-native';

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
    const { t, i18n } = useTranslation('profile');
    const isRTL = i18n.language === 'ar';
    const displayName = buildProfileDisplayName(profile);
    const initials = getInitials(displayName);

    return (
        <View className={`mb-6 flex-row items-center rounded-[28px] bg-primary-700 p-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <View className={`${isRTL ? 'ml-4' : 'mr-4'} h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-primary-400`}>
                <Text className="font-jakarta-bold text-2xl text-surface">
                    {initials}
                </Text>
            </View>

            <View className="flex-1">
                <View className={`flex-row items-center ${isRTL ? 'justify-end' : 'justify-start'} gap-1.5`}>
                    <Text
                        className={`font-jakarta-bold text-[17px] text-surface`}
                        numberOfLines={1}
                    >
                        {displayName}
                    </Text>
                    {profile.identityVerificationStatus === 'Verified' ? (
                        <ShieldCheck size={24} color="#5CCFA9" strokeWidth={2.5} />
                    ) : profile.identityVerificationStatus ? (
                        <ShieldAlert size={24} color="#FFB020" strokeWidth={2.5} />
                    ) : null}
                </View>

                <Text
                    className={`mt-1 font-inter-regular text-[11px] text-surface opacity-90 ${isRTL ? 'text-right' : 'text-left'}`}
                    ellipsizeMode="middle"
                    numberOfLines={1}
                >
                    {t('profileComponents.summary.idLabel')}: <Text className="font-jakarta-bold text-[16x]">{profile.patientCode}</Text>
                </Text>

                <View
                    className={`mt-2 rounded-full border px-3 py-1.5 ${isRTL ? 'self-end' : 'self-start'}`}
                    style={{
                        backgroundColor: colors.primary[400],
                        borderColor: colors.primary[300],
                    }}
                >
                    <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <View
                            className={`${isRTL ? 'ml-2' : 'mr-2'} h-2 w-2 rounded-full`}
                            style={{
                                backgroundColor: colors.secondary[300],
                            }}
                        />

                        <Text className={`font-jakarta-bold text-[9px] uppercase tracking-wide text-surface ${isRTL ? 'text-right' : 'text-left'}`}>
                            {profile.status || t('profileComponents.summary.unknownStatus')}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}