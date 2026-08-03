import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { router } from 'expo-router';
import {
    Bug,
    CircleHelp,
    Gavel,
    Headset,
    MessageSquare,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArrowLeft02Icon } from '@/components/icons/ArrowLeft02Icon';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon';
import { ShieldIcon } from '@/components/icons/ShieldIcon';
import { colors } from '@/lib/theme/colors';

const SUPPORT_ITEMS = [
    {
        title: 'FAQ',
        description: 'Frequently Asked Questions',
        Icon: CircleHelp,
    },
    {
        title: 'Contact Support',
        description: 'Get help from our support team',
        Icon: Headset,
    },
    {
        title: 'Report an Issue',
        description: 'Report bugs or technical issues',
        Icon: Bug,
    },
    {
        title: 'Privacy Policy',
        description: null,
        Icon: ShieldIcon,
    },
    {
        title: 'Terms & Conditions',
        description: null,
        Icon: Gavel,
    },
    {
        title: 'About Hakeem',
        description: 'Version 1.0.0',
        Icon: InfoCircleIcon,
    },
] as const;

function showUnavailableAction(title: string) {
    Alert.alert(
        'Coming soon',
        `${title} is not connected yet.`,
    );
}

export default function HelpScreen() {
    return (
        <SafeAreaView
            className="flex-1 bg-bg"
            edges={['top']}
        >
            {/* Header */}
            <View className="mb-6 mt-2 flex-row items-center px-6">
                <Pressable
                    accessibilityLabel="Return to Profile"
                    accessibilityRole="button"
                    className="mr-4 h-10 w-10 items-center justify-center rounded-full border border-bg-600 bg-surface"
                    hitSlop={8}
                    onPress={() => router.back()}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                    })}
                >
                    <ArrowLeft02Icon
                        size={20}
                        color={colors.text[800]}
                    />
                </Pressable>

                <Text className="font-jakarta-bold text-[22px] text-primary-900">
                    Help &amp; Support
                </Text>
            </View>

            <ScrollView
                className="flex-1 px-6"
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Support options */}
                <View className="overflow-hidden rounded-[22px] border border-bg-600 bg-surface">
                    {SUPPORT_ITEMS.map((item, index) => {
                        const ItemIcon = item.Icon;

                        const hasDivider =
                            index <
                            SUPPORT_ITEMS.length - 1;

                        return (
                            <Pressable
                                key={item.title}
                                accessibilityLabel={
                                    item.title
                                }
                                accessibilityRole="button"
                                className="flex-row items-center pl-4"
                                onPress={() =>
                                    showUnavailableAction(
                                        item.title,
                                    )
                                }
                                style={({ pressed }) => ({
                                    backgroundColor: pressed
                                        ? colors.bg[100]
                                        : colors.surface
                                            .DEFAULT,
                                })}
                            >
                                <View className="h-9 w-9 items-center justify-center rounded-[10px] bg-bg-600/30">
                                    <ItemIcon
                                        size={20}
                                        color={
                                            colors.primary[900]
                                        }
                                    />
                                </View>

                                <View
                                    className={`ml-3 min-h-[65px] flex-1 flex-row items-center py-3 pr-3 ${hasDivider
                                        ? 'border-b border-bg-600/40'
                                        : ''
                                        }`}
                                >
                                    <View className="flex-1 justify-center">
                                        <Text
                                            className="font-jakarta-regular text-[14px] leading-[19px] text-text"
                                            numberOfLines={1}
                                        >
                                            {item.title}
                                        </Text>

                                        {item.description ? (
                                            <Text
                                                className="mt-0.5 font-inter-regular text-[10px] leading-[14px] text-text2-500"
                                                numberOfLines={
                                                    1
                                                }
                                            >
                                                {
                                                    item.description
                                                }
                                            </Text>
                                        ) : null}
                                    </View>

                                    <ChevronRightIcon
                                        size={18}
                                        color={
                                            colors.text2[500]
                                        }
                                    />
                                </View>
                            </Pressable>
                        );
                    })}
                </View>

                <View className="min-h-10 flex-1" />

                {/* Immediate assistance */}
                <View className="items-center">
                    <Text className="font-inter-regular text-[14px] text-text2-500">
                        Need immediate assistance?
                    </Text>

                    <Pressable
                        accessibilityLabel="Contact Support"
                        accessibilityRole="button"
                        android_ripple={{
                            color: colors.primary[800],
                        }}
                        className="mt-4 h-[52px] w-full max-w-[288px] flex-row items-center justify-center overflow-hidden rounded-full bg-primary-900"
                        onPress={() =>
                            showUnavailableAction(
                                'Contact Support',
                            )
                        }
                        style={({ pressed }) => [
                            styles.contactButton,
                            pressed &&
                            styles.contactButtonPressed,
                        ]}
                    >
                        <MessageSquare
                            size={19}
                            color={colors.surface.DEFAULT}
                        />

                        <Text className="ml-2 font-jakarta-medium text-[15px] text-surface">
                            Contact Support
                        </Text>
                    </Pressable>

                    <Text className="mt-5 font-inter-regular text-[9px] tracking-[0.1px] text-text2-500">
                        HIPAA-compliant • Secure • 24/7
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 28,
    },
    contactButton: {
        elevation: 5,
        shadowColor: colors.text[900],
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.16,
        shadowRadius: 6,
    },
    contactButtonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.99 }],
    },
});
