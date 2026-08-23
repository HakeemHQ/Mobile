import { View } from 'react-native';
import {
    CalendarDays,
    FlaskConical,
    Pill,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { FastAccessButton } from '@/components/ui/FastAccessButton';
import { colors } from '@/lib/theme';
import type { ReminderType } from '@/types/reminder';

interface ReminderTypeSelectorProps {
    selectedType: ReminderType;
    onSelect: (
        type: ReminderType,
    ) => void;
}

const reminderTypes = [
    {
        type: 'MEDICATION' as const,
        translationKey:
            'types.medication',
        defaultLabel: 'Medication',
        Icon: Pill,
        accentColor:
            colors.primary.DEFAULT,
        circleColor:
            'bg-primary-50',
    },
    {
        type: 'APPOINTMENT' as const,
        translationKey:
            'types.appointment',
        defaultLabel: 'Appointment',
        Icon: CalendarDays,
        accentColor:
            colors.secondary.DEFAULT,
        circleColor:
            'bg-secondary-50',
    },
    {
        type: 'LAB_TEST' as const,
        translationKey:
            'types.labTest',
        defaultLabel: 'Lab Test',
        Icon: FlaskConical,
        accentColor:
            colors.tertiary.DEFAULT,
        circleColor:
            'bg-tertiary-50',
    },
];

export function ReminderTypeSelector({
    selectedType,
    onSelect,
}: ReminderTypeSelectorProps) {
    const { t } =
        useTranslation('reminders');

    return (
        <View className="flex-row justify-between gap-2">
            {reminderTypes.map(
                ({
                    type,
                    translationKey,
                    defaultLabel,
                    Icon,
                    accentColor,
                    circleColor,
                }) => {
                    const label = t(
                        translationKey,
                        {
                            defaultValue:
                                defaultLabel,
                        },
                    );

                    const isSelected =
                        selectedType === type;

                    return (
                        <FastAccessButton
                            key={type}
                            title={label}
                            icon={
                                <Icon
                                    size={25}
                                    color={
                                        accentColor
                                    }
                                    strokeWidth={2}
                                />
                            }
                            active={
                                isSelected
                            }
                            activeBgColor="bg-surface"
                            inactiveBgColor="bg-surface"
                            activeBorderColor="border-[1.5px]"
                            inactiveBorderColor="border-[1px]"
                            activeCircleColor={
                                circleColor
                            }
                            inactiveCircleColor={
                                circleColor
                            }
                            activeTextColor="text-text-900"
                            inactiveTextColor="text-text-900"
                            style={{
                                width: '31.5%',
                                height: 108,
                                paddingHorizontal: 12,
                                borderColor:
                                    isSelected
                                        ? accentColor
                                        : colors.text2[50],
                            }}
                            onPress={() =>
                                onSelect(type)
                            }
                            accessibilityLabel={`Select ${label} reminder`}
                        />
                    );
                },
            )}
        </View>
    );
}