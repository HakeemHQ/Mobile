import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import {
    Bot,
    FlaskConical,
    Send,
    X,
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

type ChatMessageRole = 'user' | 'assistant';

interface ChatMessage {
    id: string;
    role: ChatMessageRole;
    content: string;
}

interface MessageBubbleProps {
    message: ChatMessage;
}

function MessageBubble({
    message,
}: MessageBubbleProps) {
    const isUser = message.role === 'user';

    if (isUser) {
        return (
            <View className="mb-5 items-end">
                <View
                    className="rounded-[22px] px-5 py-3.5"
                    style={{
                        maxWidth: '78%',
                        backgroundColor: colors.bg.DEFAULT,
                    }}
                >
                    <FormattedAssistantMessage
                        content={message.content}
                    />
                </View>
            </View>
        );
    }

    return (
        <View className="mb-5 items-start">
            <View
                className="relative rounded-[22px] px-5 py-4"
                style={{
                    maxWidth: '88%',
                    backgroundColor: colors.surface[600],
                    borderBottomLeftRadius: 5,
                }}
            >
                <View
                    pointerEvents="none"
                    style={{
                        position: 'absolute',
                        bottom: 2,
                        left: -8,
                        width: 19,
                        height: 19,
                        backgroundColor: colors.surface[600],
                        transform: [
                            {
                                rotate: '45deg',
                            },
                        ],
                    }}
                />

                <FormattedAssistantMessage
                    content={message.content}
                />
            </View>
        </View>
    );
}

export default function ChatbotScreen() {
    const scrollViewRef = useRef<ScrollView>(null);

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
                    ? `Hello there ${firstName}, how can I help you today?`
                    : 'Hello there, how can I help you today?',
            };
        }, [profile?.firstName]);

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
                    'Unable to get a response from H-bot.',
                );

                return;
            }

            const assistantText =
                response.data.message?.trim();

            if (!assistantText) {
                setSendError(
                    'H-bot returned an empty response.',
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
                'Unable to connect to H-bot. Please try again.',
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
            className="flex-1"
            edges={['top', 'bottom']}
            style={{
                backgroundColor:
                    colors.primary.DEFAULT,
            }}
        >
            <StatusBar style="light" />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <View
                    className="h-[112px] flex-row items-center px-7"
                    style={{
                        borderBottomColor:
                            colors.text2[300],
                        borderBottomWidth: 1,
                    }}
                >
                    <View className="flex-row items-center">
                        <Bot
                            size={44}
                            color={
                                colors.surface.DEFAULT
                            }
                            strokeWidth={1.8}
                        />

                        <Text
                            className="ml-5 font-jakarta-bold text-[30px]"
                            style={{
                                color:
                                    colors.surface.DEFAULT,
                            }}
                        >
                            H-bot
                        </Text>
                    </View>

                    <View className="flex-1" />

                    <Pressable
                        accessibilityLabel="Close H-bot"
                        accessibilityRole="button"
                        className="h-12 w-12 items-center justify-center"
                        hitSlop={8}
                        onPress={handleClose}
                        style={({ pressed }) => ({
                            opacity:
                                pressed ? 0.65 : 1,
                        })}
                    >
                        <X
                            size={38}
                            color={
                                colors.surface.DEFAULT
                            }
                            strokeWidth={1.7}
                        />
                    </Pressable>
                </View>

                <View className="flex-1">
                    <View
                        pointerEvents="none"
                        className="absolute left-0 right-0 items-center"
                        style={{
                            top: '40%',
                        }}
                    >
                        <FlaskConical
                            size={155}
                            color={
                                colors.surface.DEFAULT
                            }
                            strokeWidth={1.35}
                        />
                    </View>

                    <ScrollView
                        ref={scrollViewRef}
                        className="flex-1"
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingHorizontal: 28,
                            paddingTop: 42,
                            paddingBottom: 36,
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
                        style={{
                            zIndex: 1,
                        }}
                    >
                        {displayedMessages.map(
                            (message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                />
                            ),
                        )}
                    </ScrollView>
                </View>

                <View className="px-7 pb-2 pt-3">
                    {sendError ? (
                        <Text
                            className="mb-2 px-3 font-inter-medium text-[12px]"
                            style={{
                                color:
                                    colors.surface.DEFAULT,
                            }}
                        >
                            {sendError}
                        </Text>
                    ) : null}

                    <View
                        className="min-h-[58px] flex-row items-center rounded-[30px] px-5"
                        style={{
                            backgroundColor:
                                colors.bg.DEFAULT,
                        }}
                    >
                        <TextInput
                            accessibilityLabel="H-bot message"
                            className="flex-1 font-inter-regular text-[18px]"
                            placeholder="Enter message"
                            placeholderTextColor={
                                colors.text2[400]
                            }
                            returnKeyType="send"
                            selectionColor={
                                colors.primary.DEFAULT
                            }
                            value={draftMessage}
                            editable={!isSending}
                            onChangeText={(value) => {
                                setDraftMessage(value);

                                if (sendError) {
                                    setSendError('');
                                }
                            }}
                            onSubmitEditing={() => {
                                void handleSend();
                            }}
                            style={{
                                color:
                                    colors.text.DEFAULT,
                                paddingVertical: 0,
                            }}
                        />

                        <Pressable
                            accessibilityLabel="Send message"
                            accessibilityRole="button"
                            accessibilityState={{
                                disabled: !canSend,
                            }}
                            className="ml-2 h-11 w-11 items-center justify-center"
                            disabled={!canSend}
                            hitSlop={5}
                            onPress={() => {
                                void handleSend();
                            }}
                            style={({ pressed }) => ({
                                opacity: !canSend
                                    ? 0.4
                                    : pressed
                                        ? 0.55
                                        : 1,
                            })}
                        >
                            {isSending ? (
                                <ActivityIndicator
                                    size="small"
                                    color={
                                        colors.text2[500]
                                    }
                                />
                            ) : (
                                <Send
                                    size={28}
                                    color={
                                        colors.text2[500]
                                    }
                                    strokeWidth={1.7}
                                />
                            )}
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}