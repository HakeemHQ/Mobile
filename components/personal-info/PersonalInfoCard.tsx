import type { ReactNode } from 'react';
import {
    Pressable,
    Text,
    View,
} from 'react-native';
import {
    PencilLine,
    Settings2,
} from 'lucide-react-native';

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
}

function PersonalInfoRow({
    label,
    value,
    leadingIcon,
    trailingIcon,
    actionAccessibilityLabel,
    onActionPress,
    showDivider = true,
}: PersonalInfoRowProps) {
    return (
        <View
            className={`flex-row items-center px-5 py-[16px] ${showDivider
                ? 'border-b border-bg-600/30'
                : ''
                }`}
        >
            <View className="mr-4 h-[42px] w-[42px] items-center justify-center rounded-[16px] bg-primary-50">
                {leadingIcon}
            </View>

            <View className="flex-1">
                <Text className="font-jakarta-semibold text-[12px] uppercase tracking-wider text-primary-900">
                    {label}
                </Text>

                <Text
                    className="mt-1 font-inter-regular text-[14px] leading-[18px] text-text-500"
                    numberOfLines={1}
                >
                    {value}
                </Text>
            </View>

            {onActionPress && trailingIcon ? (
                <Pressable
                    accessibilityLabel={actionAccessibilityLabel}
                    accessibilityRole="button"
                    className="ml-3 h-10 w-10 items-center justify-center rounded-full"
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
                <View className="ml-3 h-10 w-10" />
            )}
        </View>
    );
}

export function PersonalInfoCard({
    profile,
    onEdit,
}: PersonalInfoCardProps) {
    const primaryIconColor = colors.primary[900];
    const actionIconColor = colors.text2[200];
    const normalizedGender = profile.gender?.trim().toLowerCase();

    return (
        <View className="overflow-hidden rounded-[28px] border border-bg-600/40 bg-surface">
            <PersonalInfoRow
                label="First Name"
                value={profile.firstName || 'Not provided'}
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
                actionAccessibilityLabel="Edit first name"
                onActionPress={() => onEdit('firstName')}
            />

            <PersonalInfoRow
                label="Last Name"
                value={profile.lastName || 'Not provided'}
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
                actionAccessibilityLabel="Edit last name"
                onActionPress={() => onEdit('lastName')}
            />

            <PersonalInfoRow
                label="Email Address"
                value={profile.email || 'Not provided'}
                leadingIcon={
                    <Mail01Icon
                        size={20}
                        color={primaryIconColor}
                    />
                }
                trailingIcon={
                    <Settings2
                        size={18}
                        color={actionIconColor}
                        strokeWidth={1.9}
                    />
                }
                actionAccessibilityLabel="Edit email address"
                onActionPress={() => onEdit('email')}
            />

            <PersonalInfoRow
                label="Phone Number"
                value={profile.phoneNumber || 'Not provided'}
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
                actionAccessibilityLabel="Edit phone number"
                onActionPress={() => onEdit('phoneNumber')}
                showDivider={false}
            />

            <PersonalInfoRow
                label="Birth Date"
                value={formatProfileBirthDate(
                    profile.birthDate,
                )}
                leadingIcon={
                    <Calendar03Icon
                        size={20}
                        color={primaryIconColor}
                    />
                }
            />

            <PersonalInfoRow
                label="Gender"
                value={profile.gender || 'Not provided'}
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
            />
        </View>
    );
}