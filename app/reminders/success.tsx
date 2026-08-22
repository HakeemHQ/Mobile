import {
    BackHandler,
    ScrollView,
    Text,
    View,
} from 'react-native';

import {
    useEffect,
} from 'react';

import {
    useRouter,
} from 'expo-router';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    StatusBar,
} from 'expo-status-bar';

import {
    useTranslation,
} from 'react-i18next';

import {
    Pill,
} from 'lucide-react-native';

import {
    SuccessIcon,
} from '@/components/ui/SuccessIcon';

import {
    colors,
} from '@/lib/theme/colors';

import {
    useMedicationDraftStore,
} from '@/store/useMedicationDraftStore';
import { Button } from '@/components/ui/Button';

export default function ReminderSuccessScreen() {
    const router =
        useRouter();

    const { t, i18n } =
        useTranslation(['reminders', 'common']);
    const isRTL =
        (i18n.language || '').startsWith('ar');

    const summary =
        useMedicationDraftStore(
            (state) =>
                state.lastSavedSummary,
        );

    const clearSummary =
        useMedicationDraftStore(
            (state) =>
                state.clearLastSavedSummary,
        );

    useEffect(() => {
        const onHardwareBackPress = () => {
            clearSummary();
            router.dismissAll();
            return true;
        };

        const subscription =
            BackHandler.addEventListener(
                'hardwareBackPress',
                onHardwareBackPress,
            );

        return () => {
            subscription.remove();
        };
    }, [
        clearSummary,
        router,
    ]);

    const goToReminderList = () => {
        clearSummary();
        router.dismissAll();
    };

    const addAnotherReminder =
        () => {
            clearSummary();

            router.replace(
                '/reminders/add',
            );
        };

    const getFrequencyText = (frequencyType: string, scheduleCount: number) => {
        if (frequencyType === 'DAILY') {
            return t('timeDaily', { count: scheduleCount, defaultValue: `${scheduleCount} مرات / يوم` });
        }
        if (frequencyType === 'WEEKLY') {
            return t('timeOnSelectedDays', { count: scheduleCount, defaultValue: `${scheduleCount} مرات في الأيام المحددة` });
        }
        return t('timeOnSelectedDates', { count: scheduleCount, defaultValue: `${scheduleCount} مرات في التواريخ المحددة` });
    };

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
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        alignItems:
                            'center',
                        paddingHorizontal:
                            28,
                        paddingTop: 70,
                        paddingBottom:
                            32,
                    }}
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    <SuccessIcon />

                    <Text className="mt-9 font-jakarta-bold text-[30px] text-text-900">
                        {t('allSet', { defaultValue: 'تم بنجاح!' })}
                    </Text>

                    <Text className="mt-4 text-center font-inter-semibold text-[16px] leading-6 text-text2-400">
                        {t('remindersSavedSuccess', { defaultValue: 'تم حفظ تذكيراتك بنجاح' })}
                    </Text>

                    <View
                        className="mt-7 w-full rounded-2xl border bg-surface px-5 py-5"
                        style={{
                            borderColor:
                                colors.text2[100],
                        }}
                    >
                        <Text className={`font-jakarta-semibold text-[15px] text-text2-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('medicationsAddedCount', { count: summary.length, defaultValue: `تمت إضافة ${summary.length} أدوية` })}
                        </Text>

                        <View className="mt-3">
                            {summary.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const accentPalette =
                                        index %
                                            2 ===
                                            1
                                            ? colors.secondary
                                            : colors.primary;

                                    return (
                                        <View
                                            key={
                                                item.draftId
                                            }
                                            className={`mb-3 flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}
                                        >
                                            <View
                                                className="h-8 w-8 items-center justify-center rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        accentPalette[50],
                                                }}
                                            >
                                                <Pill
                                                    size={17}
                                                    color={
                                                        accentPalette.DEFAULT
                                                    }
                                                    strokeWidth={2}
                                                />
                                            </View>

                                            <Text
                                                className={`${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'} flex-1 font-jakarta-bold text-[14px] text-text-900`}
                                                numberOfLines={1}
                                            >
                                                {
                                                    item.title
                                                }
                                            </Text>

                                            <Text className="font-inter-semibold text-[13px] text-text2-400">
                                                {getFrequencyText(item.frequencyType, item.scheduleCount)}
                                            </Text>
                                        </View>
                                    );
                                },
                            )}
                        </View>
                    </View>
                </ScrollView>

                <View className="gap-3 px-5 pb-2">
                    <Button
                        title={t('goToRemindersList', { defaultValue: 'الانتقال إلى قائمة التذكيرات' })}
                        variant="primary"
                        className="h-14"
                        onPress={
                            goToReminderList
                        }
                    />

                    <Button
                        title={t('addAnotherReminder', { defaultValue: 'إضافة تذكير آخر' })}
                        variant="outline"
                        className="h-14"
                        onPress={
                            addAnotherReminder
                        }
                    />
                </View>
            </SafeAreaView>
        </>
    );
}
