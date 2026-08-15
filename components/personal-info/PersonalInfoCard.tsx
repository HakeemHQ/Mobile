import type { ReactNode } from 'react';
import {
    Pressable,
    Text,
    View,
} from 'react-native';
import {
    PencilLine,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Calendar03Icon } from '@/components/icons/Calendar03Icon';
import { Call02Icon } from '@/components/icons/Call02Icon';
import { Mail01Icon } from '@/components/icons/Mail01Icon';
import { FemaleIcon } from '@/components/icons/FemaleIcon';
import { MaleIcon } from '@/components/icons/MaleIcon';
import { User02Icon } from '@/components/icons/User02Icon';
import { colors } from '@/lib/theme/colors';
import { formatProfileBirthDate } from '@/lib/profile-utils';
import type {
    EditableProfileField,
    ProfileData,
} from '@/types/profile';

interface PersonalInfoCardProps {
    profile: ProfileData;
    onEdit: (field: EditableProfileField) => void;
}

interface PersonalInfoRowProps {
    label: string;
    value: string;
    leadingIcon: ReactNode;
    trailingIcon?: ReactNode;
    actionAccessibilityLabel?: string;
    onActionPress?: () => void;
    showDivider?: boolean;
    isRTL: boolean;
}

function PersonalInfoRow({
    label,
    value,
    leadingIcon,
    trailingIcon,
    actionAccessibilityLabel,
    onActionPress,
    showDivider = true,
    isRTL,
}: PersonalInfoRowProps) {
    return (
        <View
            className={`flex-row items-center px-5 py-[16px] ${isRTL ? 'flex-row-reverse' : ''} ${showDivider
                ? 'border-b border-bg-600/30'
                : ''
                }`}
        >
            <View className={`${isRTL ? 'ml-4' : 'mr-4'} h-[42px] w-[42px] items-center justify-center rounded-[16px] bg-primary-50`}>
                {leadingIcon}
            </View>

            <View className="flex-1">
                <Text className={`font-jakarta-semibold text-[12px] uppercase tracking-wider text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {label}
                </Text>

                <Text
                    className={`mt-1 font-inter-regular text-[14px] leading-[18px] text-text-500 ${isRTL ? 'text-right' : 'text-left'}`}
                    numberOfLines={1}
                >
                    {value}
                </Text>
            </View>

            {onActionPress && trailingIcon ? (
                <Pressable
                    accessibilityLabel={actionAccessibilityLabel}
                    accessibilityRole="button"
                    className={`${isRTL ? 'mr-3' : 'ml-3'} h-10 w-10 items-center justify-center rounded-full`}
                    hitSlop={6}
                    onPress={onActionPress}
                >
                    {({ pressed }) => (
                        <View
                            className={
                                pressed ? 'opacity-50' : 'opacity-100'
                            }
                        >
                            {trailingIcon}
                        </View>
                    )}
                </Pressable>
            ) : (
                <View className={`${isRTL ? 'mr-3' : 'ml-3'} h-10 w-10`} />
            )}
        </View>
    );
}

export function PersonalInfoCard({
    profile,
    onEdit,
}: PersonalInfoCardProps) {
    const { t, i18n } = useTranslation('profile');
    const isRTL = i18n.language === 'ar';
    const primaryIconColor = colors.primary[900];
    const actionIconColor = colors.text2[200];
    const normalizedGender = profile.gender?.trim().toLowerCase();
    const notProvided = t('profileComponents.personalInfoCard.notProvided');

    const genderValue =
        normalizedGender === 'male'
            ? t('profileComponents.personalInfoCard.male')
            : normalizedGender === 'female'
                ? t('profileComponents.personalInfoCard.female')
                : profile.gender || notProvided;

    return (
        <View className="overflow-hidden rounded-[28px] border border-bg-600/40 bg-surface">
            <PersonalInfoRow
                label={t('profileComponents.personalInfoCard.firstName')}
                value={profile.firstName || notProvided}
                leadingIcon={
                    <User02Icon
                        size={20}
                        color={primaryIconColor}
                    />
                }
                trailingIcon={
                    <PencilLine
                        size={18}
                        color={actionIconColor}
                        strokeWidth={1.9}
                    />
                }
                actionAccessibilityLabel={t('profileComponents.personalInfoCard.editFirstName')}
                onActionPress={() => onEdit('firstName')}
                isRTL={isRTL}
            />

            <PersonalInfoRow
                label={t('profileComponents.personalInfoCard.lastName')}
                value={profile.lastName || notProvided}
                leadingIcon={
                    <User02Icon
                        size={20}
                        color={primaryIconColor}
                    />
                }
                trailingIcon={
                    <PencilLine
                        size={18}
                        color={actionIconColor}
                        strokeWidth={1.9}
                    />
                }
                actionAccessibilityLabel={t('profileComponents.personalInfoCard.editLastName')}
                onActionPress={() => onEdit('lastName')}
                isRTL={isRTL}
            />

            <PersonalInfoRow
                label={t('profileComponents.personalInfoCard.emailAddress')}
                value={profile.email || notProvided}
                leadingIcon={
                    <Mail01Icon
                        size={20}
                        color={primaryIconColor}
                    />
                }
                isRTL={isRTL}
            />

            <PersonalInfoRow
                label={t('profileComponents.personalInfoCard.phoneNumber')}
                value={profile.phoneNumber || notProvided}
                leadingIcon={
                    <Call02Icon
                        size={20}
                        color={primaryIconColor}
                    />
                }
                trailingIcon={
                    <PencilLine
                        size={18}
                        color={actionIconColor}
                        strokeWidth={1.9}
                    />
                }
                actionAccessibilityLabel={t('profileComponents.personalInfoCard.editPhoneNumber')}
                onActionPress={() => onEdit('phoneNumber')}
                isRTL={isRTL}
            />

            <PersonalInfoRow
                label={t('profileComponents.personalInfoCard.birthDate')}
                value={formatProfileBirthDate(
                    profile.birthDate,
                )}
                leadingIcon={
                    <Calendar03Icon
                        size={20}
                        color={primaryIconColor}
                    />
                }
                isRTL={isRTL}
            />

            <PersonalInfoRow
                label={t('profileComponents.personalInfoCard.gender')}
                value={genderValue}
                leadingIcon={
                    normalizedGender === 'male' ? (
                        <MaleIcon
                            size={20}
                            color={primaryIconColor}
                        />
                    ) : normalizedGender === 'female' ? (
                        <FemaleIcon
                            size={20}
                            color={primaryIconColor}
                        />
                    ) : (
                        <User02Icon
                            size={20}
                            color={primaryIconColor}
                        />
                    )
                }
                isRTL={isRTL}
            />

            {profile.nationalIdMasked && (
                <PersonalInfoRow
                    label={'National ID'}
                    value={profile.nationalIdMasked}
                    leadingIcon={
                        <User02Icon
                            size={20}
                            color={primaryIconColor}
                        />
                    }
                    showDivider={false}
                    isRTL={isRTL}
                />
            )}
        </View>
    );
}