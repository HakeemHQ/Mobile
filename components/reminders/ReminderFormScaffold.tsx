import type {
    ReactNode,
} from 'react';

import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';

import {
    StatusBar,
} from 'expo-status-bar';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    useTranslation,
} from 'react-i18next';

import {
    ReminderScreenHeader,
} from '@/components/reminders/ReminderScreenHeader';

import {
    ReminderTypeSelector,
} from '@/components/reminders/ReminderTypeSelector';

import {
    Button,
} from '@/components/ui/Button';

import type {
    ReminderType,
} from '@/types/reminder';

interface ReminderFormScaffoldProps {
    selectedType: ReminderType;
    onSelectType: (
        type: ReminderType,
    ) => void;
    onBack: () => void;
    onSubmit: () => void;
    submitTitle: string;
    isSubmitting: boolean;
    children: ReactNode;
    showTypeSelector?: boolean;
}

export function ReminderFormScaffold({
    selectedType,
    onSelectType,
    onBack,
    onSubmit,
    submitTitle,
    isSubmitting,
    children,
    showTypeSelector = true,
}: ReminderFormScaffoldProps) {
    const { t, i18n } =
        useTranslation(
            'reminders',
        );
    const isRTL =
        i18n.language === 'ar';

    return (
        <>
            <StatusBar style="dark" />

            <SafeAreaView
                className="flex-1 bg-bg"
                edges={[
                    'top',
                    'bottom',
                ]}
            >
                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={
                        Platform.OS ===
                            'ios'
                            ? 'padding'
                            : undefined
                    }
                >
                    <ReminderScreenHeader
                        title={t('addTitle')}
                        onBack={onBack}
                    />

                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{
                            paddingHorizontal:
                                24,
                            paddingBottom:
                                20,
                        }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={
                            false
                        }
                    >
                        {showTypeSelector ? (
                            <>
                                <Text className={`mb-3 font-jakarta-semibold text-[13px] text-text2-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    {t('reminderType')}
                                </Text>

                                <ReminderTypeSelector
                                    selectedType={
                                        selectedType
                                    }
                                    onSelect={
                                        onSelectType
                                    }
                                />
                            </>
                        ) : null}

                        <View
                            className={
                                showTypeSelector
                                    ? 'mt-5'
                                    : undefined
                            }
                        >
                            {children}
                        </View>
                    </ScrollView>

                    <View className="px-5 pb-1 pt-2">
                        <Button
                            title={
                                isSubmitting
                                    ? t('saving')
                                    : submitTitle
                            }
                            className="h-[56px] rounded-2xl"
                            disabled={
                                isSubmitting
                            }
                            onPress={
                                onSubmit
                            }
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}
