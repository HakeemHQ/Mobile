import {
    type ComponentRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import {
    ArrowLeft,
    ArrowRight,
    Bot,
    Send,
    ShieldCheck,
} from 'lucide-react-native';
import {
    router,
    useFocusEffect,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import FormattedAssistantMessage from '@/components/chatbot/FormattedAssistantMessage';
import { sendChatbotMessageApi } from '@/lib/api';
import { colors } from '@/lib/theme/colors';
import { useProfileStore } from '@/store/useProfileStore';
import { useTranslation } from 'react-i18next';
import {
    KeyboardChatScrollView,
    KeyboardStickyView,
} from 'react-native-keyboard-controller';

type ChatMessageRole = 'user' | 'assistant';

interface ChatMessage {
    id: string;
    role: ChatMessageRole;
    content: string;
}

interface MessageBubbleProps {
    message: ChatMessage;
}

function AssistantAvatar() {
    return (
        <View
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{
                backgroundColor: colors.primary[50],
            }}
        >
            <Bot
                size={20}
                color={colors.primary[900]}
                strokeWidth={1.9}
            />
        </View>
    );
}

function MessageBubble({
    message,
}: MessageBubbleProps) {
    const isUser = message.role === 'user';

    if (isUser) {
        return (
            <View className="mb-4 items-end">
                <View
                    className="rounded-[22px] rounded-br-[7px] px-4 py-3"
                    style={{
                        maxWidth: '80%',
                        backgroundColor:
                            colors.primary.DEFAULT,
                    }}
                >
                    <Text
                        className="font-inter-regular text-[15px] leading-[22px]"
                        style={{
                            color:
                                colors.surface.DEFAULT,
                        }}
                    >
                        {message.content}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View className="mb-4 flex-row items-end">
            <View className="mr-2">
                <AssistantAvatar />
            </View>

            <View
                className="rounded-[22px] rounded-bl-[7px] border px-4 py-3.5"
                style={{
                    maxWidth: '79%',
                    backgroundColor:
                        colors.surface.DEFAULT,
                    borderColor:
                        colors.bg[600],
                }}
            >
                <FormattedAssistantMessage
                    content={message.content}
                />
            </View>
        </View>
    );
}

export default function ChatbotScreen() {
    const { t, i18n } = useTranslation('chatbot');
    const isRTL = i18n.dir() === 'rtl';

    const scrollViewRef =
        useRef<ComponentRef<typeof KeyboardChatScrollView>>(null);

    const chatSessionRef = useRef(0);

    const profile = useProfileStore(
        (state) => state.profile,
    );

    const fetchProfile = useProfileStore(
        (state) => state.fetchProfile,
    );

    const [draftMessage, setDraftMessage] =
        useState('');

    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const [isSending, setIsSending] =
        useState(false);

    const [sendError, setSendError] =
        useState('');

    useFocusEffect(
        useCallback(() => {
            chatSessionRef.current += 1;

            setMessages([]);
            setDraftMessage('');
            setSendError('');
            setIsSending(false);

            return () => {
                chatSessionRef.current += 1;
            };
        }, []),
    );

    useEffect(() => {
        void fetchProfile();
    }, [fetchProfile]);

    const greetingMessage =
        useMemo<ChatMessage>(() => {
            const firstName =
                profile?.firstName?.trim();

            return {
                id: 'initial-hbot-greeting',
                role: 'assistant',
                content: firstName
                    ? t('greetingWithName', { firstName })
                    : t('greeting'),
            };
        }, [profile?.firstName, t]);

    const displayedMessages = useMemo(
        () => [
            greetingMessage,
            ...messages,
        ],
        [
            greetingMessage,
            messages,
        ],
    );

    const normalizedDraft =
        draftMessage.trim();

    const canSend =
        normalizedDraft.length > 0 &&
        !isSending;

    const scrollToBottom = (
        animated = true,
    ) => {
        requestAnimationFrame(() => {
            scrollViewRef.current?.scrollToEnd({
                animated,
            });
        });
    };

    const handleClose = () => {
        router.replace('/(tabs)');
    };

    const handleSend = async () => {
        if (!canSend) {
            return;
        }

        const activeChatSession =
            chatSessionRef.current;

        const submittedMessage =
            normalizedDraft;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: submittedMessage,
        };

        setMessages(
            (currentMessages) => [
                ...currentMessages,
                userMessage,
            ],
        );

        setDraftMessage('');
        setSendError('');
        setIsSending(true);

        scrollToBottom();

        try {
            const response =
                await sendChatbotMessageApi({
                    message: submittedMessage,
                });

            if (
                activeChatSession !==
                chatSessionRef.current
            ) {
                return;
            }

            if (
                !response.success ||
                !response.data
            ) {
                setSendError(
                    response.message ||
                    t('errors.unableToGetResponse'),
                );

                return;
            }

            const assistantText =
                response.data.message?.trim();

            if (!assistantText) {
                setSendError(
                    t('errors.emptyResponse'),
                );

                return;
            }

            const assistantMessage: ChatMessage =
            {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: assistantText,
            };

            setMessages(
                (currentMessages) => [
                    ...currentMessages,
                    assistantMessage,
                ],
            );
        } catch (error: unknown) {
            if (
                activeChatSession !==
                chatSessionRef.current
            ) {
                return;
            }

            const apiError = error as {
                message?: string;
            };

            setSendError(
                apiError.message ||
                t('errors.unableToConnect'),
            );
        } finally {
            if (
                activeChatSession ===
                chatSessionRef.current
            ) {
                setIsSending(false);
                scrollToBottom();
            }
        }
    };

    return (
        <SafeAreaView
            className="flex-1 bg-bg"
            edges={['top', 'bottom']}
        >
            <StatusBar style="dark" />

            <View className="flex-1">
                <View
                    className="items-center border-b px-5 py-3"
                    style={{
                        flexDirection:
                            isRTL
                                ? 'row-reverse'
                                : 'row',
                        borderBottomColor:
                            colors.bg[600],
                        backgroundColor:
                            colors.surface.DEFAULT,
                    }}
                >
                    <Pressable
                        accessibilityLabel={t('closeHbot')}
                        accessibilityRole="button"
                        className="h-10 w-10 items-center justify-center rounded-full"
                        hitSlop={8}
                        onPress={handleClose}
                        style={({ pressed }) => ({
                            backgroundColor:
                                pressed
                                    ? colors.primary[50]
                                    : colors.surface.DEFAULT,
                        })}
                    >
                        {isRTL ? (
                            <ArrowRight
                                size={23}
                                color={colors.primary[900]}
                                strokeWidth={2}
                            />
                        ) : (
                            <ArrowLeft
                                size={23}
                                color={colors.primary[900]}
                                strokeWidth={2}
                            />
                        )}
                    </Pressable>

                    <View
                        className="h-11 w-11 items-center justify-center rounded-full"
                        style={{
                            marginRight: isRTL ? 0 : 12,
                            marginLeft: isRTL ? 12 : 0,
                            backgroundColor:
                                colors.primary[900],
                        }}
                    >
                        <Bot
                            size={24}
                            color={
                                colors.surface.DEFAULT
                            }
                            strokeWidth={2}
                        />
                    </View>

                    <View className="flex-1">
                        <Text
                            className="font-jakarta-bold text-[18px]"
                            style={{
                                textAlign: isRTL
                                    ? 'right'
                                    : 'left',
                                writingDirection:
                                    isRTL
                                        ? 'rtl'
                                        : 'ltr',
                                color:
                                    colors.primary[900],
                            }}
                        >
                            {t('title')}
                        </Text>

                        <Text
                            className="mt-0.5 font-inter-regular text-[12px]"
                            style={{
                                textAlign:
                                    isRTL ? 'right' : 'left',
                                writingDirection:
                                    isRTL ? 'rtl' : 'ltr',
                                color: colors.text2.DEFAULT,
                            }}
                        >
                            {t('subtitle')}
                        </Text>
                    </View>
                </View>

                <KeyboardChatScrollView
                    ref={scrollViewRef}
                    className="flex-1"
                    keyboardLiftBehavior="whenAtEnd"
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 20,
                        paddingTop: 18,
                        paddingBottom: 24,
                    }}
                    keyboardDismissMode={
                        Platform.OS === 'ios'
                            ? 'interactive'
                            : 'on-drag'
                    }
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() =>
                        scrollToBottom(false)
                    }
                >
                    <View className="mb-6 items-center">
                        <View
                            className="rounded-full px-4 py-1.5"
                            style={{
                                backgroundColor:
                                    colors.primary[50],
                            }}
                        >
                            <Text
                                className="font-inter-medium text-[12px]"
                                style={{
                                    color:
                                        colors.primary[800],
                                }}
                            >
                                Today
                            </Text>
                        </View>
                    </View>

                    {displayedMessages.map(
                        (message) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                            />
                        ),
                    )}

                    {isSending ? (
                        <View className="mb-4 flex-row items-end">
                            <View className="mr-2">
                                <AssistantAvatar />
                            </View>

                            <View
                                className="h-12 min-w-[62px] items-center justify-center rounded-[22px] rounded-bl-[7px] border px-4"
                                style={{
                                    backgroundColor:
                                        colors.surface.DEFAULT,
                                    borderColor:
                                        colors.bg[600],
                                }}
                            >
                                <ActivityIndicator
                                    size="small"
                                    color={
                                        colors.primary.DEFAULT
                                    }
                                />
                            </View>
                        </View>
                    ) : null}

                    {sendError ? (
                        <View
                            className="mb-4 rounded-2xl border px-4 py-3"
                            style={{
                                backgroundColor:
                                    colors.danger?.[50] ??
                                    colors.surface.DEFAULT,
                                borderColor:
                                    colors.danger?.[100] ??
                                    colors.bg[600],
                            }}
                        >
                            <Text
                                className="font-inter-medium text-[13px] leading-5"
                                style={{
                                    color:
                                        colors.danger?.[700] ??
                                        colors.text.DEFAULT,
                                }}
                            >
                                {sendError}
                            </Text>
                        </View>
                    ) : null}
                </KeyboardChatScrollView>

                <KeyboardStickyView>
                    <View
                        className="border-t px-4 pb-2 pt-3"
                        style={{
                            borderTopColor:
                                colors.bg[600],
                            backgroundColor:
                                colors.surface.DEFAULT,
                        }}
                    >
                        <View
                            className="min-h-[56px] items-end rounded-[28px] border px-4 py-2"
                            style={{
                                flexDirection:
                                    isRTL ? 'row-reverse' : 'row',
                                backgroundColor:
                                    colors.bg.DEFAULT,
                                borderColor:
                                    colors.bg[600],
                            }}
                        >
                            <TextInput
                                accessibilityLabel={t('messageInput')}
                                className="max-h-28 flex-1 font-inter-regular text-[15px]"
                                placeholder={t('enterMessage')}
                                placeholderTextColor={
                                    colors.text2[300]
                                }
                                selectionColor={
                                    colors.primary.DEFAULT
                                }
                                multiline
                                value={draftMessage}
                                editable={!isSending}
                                onChangeText={(value) => {
                                    setDraftMessage(value);

                                    if (sendError) {
                                        setSendError('');
                                    }
                                }}
                                style={{
                                    color:
                                        colors.text.DEFAULT,
                                    paddingBottom: 8,
                                    paddingTop: 8,
                                    textAlignVertical: 'center',
                                    textAlign:
                                        isRTL
                                            ? 'right'
                                            : 'left',
                                    writingDirection:
                                        isRTL
                                            ? 'rtl'
                                            : 'ltr',
                                }}
                            />

                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    marginLeft:
                                        isRTL ? 0 : 8,
                                    marginRight:
                                        isRTL ? 8 : 0,
                                    borderRadius: 20,
                                    backgroundColor:
                                        colors.primary[500],
                                    opacity:
                                        canSend ? 1 : 0.35,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Pressable
                                    accessibilityLabel={t('sendMessage')}
                                    accessibilityRole="button"
                                    accessibilityState={{
                                        disabled: !canSend,
                                    }}
                                    disabled={!canSend}
                                    hitSlop={5}
                                    onPress={() => {
                                        void handleSend();
                                    }}
                                    style={({ pressed }) => ({
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 0,
                                        opacity:
                                            pressed
                                                ? 0.7
                                                : 1,
                                    })}
                                >
                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Send
                                            size={18}
                                            color={colors.surface.DEFAULT}
                                            strokeWidth={2}
                                        />
                                    </View>
                                </Pressable>
                            </View>
                        </View>

                        <View className="mt-2 flex-row items-center justify-center px-4">
                            <ShieldCheck
                                size={13}
                                color={colors.secondary[700]}
                                strokeWidth={1.8}
                            />

                            <Text
                                className="ml-1.5 text-center font-inter-regular text-[10px] leading-[14px]"
                                style={{
                                    color:
                                        colors.text2.DEFAULT,
                                }}
                            >
                                AI responses may contain mistakes. Verify important medical information.
                            </Text>
                        </View>
                    </View>
                </KeyboardStickyView>
            </View>
        </SafeAreaView>
    );
}