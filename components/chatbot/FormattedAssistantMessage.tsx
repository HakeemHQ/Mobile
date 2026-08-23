import {
    Linking,
    Text,
    View,
} from 'react-native'

import { colors } from '@/lib/theme/colors';

interface FormattedAssistantMessageProps {
    content: string;
}

interface InlineTextPart {
    text: string;
    bold: boolean;
    url?: string;
}

function parseInlineText(
    value: string,
): InlineTextPart[] {
    const parts: InlineTextPart[] = [];

    const inlinePattern =
        /(\*\*(.+?)\*\*|https?:\/\/[^\s]+)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while (
        (match = inlinePattern.exec(value)) !== null
    ) {
        if (match.index > lastIndex) {
            parts.push({
                text: value.slice(
                    lastIndex,
                    match.index,
                ),
                bold: false,
            });
        }

        const matchedValue = match[0];

        if (
            matchedValue.startsWith(
                'http://',
            ) ||
            matchedValue.startsWith(
                'https://',
            )
        ) {
            parts.push({
                text: matchedValue,
                bold: false,
                url: matchedValue,
            });
        } else {
            parts.push({
                text: match[2],
                bold: true,
            });
        }

        lastIndex =
            match.index + match[0].length;
    }

    if (lastIndex < value.length) {
        parts.push({
            text: value.slice(lastIndex),
            bold: false,
        });
    }

    if (parts.length === 0) {
        return [
            {
                text: value,
                bold: false,
            },
        ];
    }

    return parts;
}

function InlineFormattedText({
    value,
}: {
    value: string;
}) {
    const parts = parseInlineText(value);

    return (
        <Text
            selectable
            className="font-inter-regular text-[16px]"
            style={{
                color: colors.text.DEFAULT,
                lineHeight: 24,
            }}
        >
            {parts.map((part, index) => (
                <Text
                    key={index}
                    accessibilityRole={
                        part.url
                            ? 'link'
                            : undefined
                    }
                    onPress={
                        part.url
                            ? () => {
                                void Linking.openURL(
                                    part.url!,
                                );
                            }
                            : undefined
                    }
                    className={
                        part.bold
                            ? 'font-inter-semibold'
                            : 'font-inter-regular'
                    }
                    style={{
                        color: part.url
                            ? colors.primary.DEFAULT
                            : part.bold
                                ? colors.text[700]
                                : colors.text.DEFAULT,
                        textDecorationLine:
                            part.url
                                ? 'underline'
                                : 'none',
                    }}
                >
                    {part.text}
                </Text>
            ))}
        </Text>
    );
}

function normalizeMessage(
    content: string,
): string[] {
    return content
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n');
}

function removeMarkdownHeading(
    line: string,
): string {
    return line.replace(/^#{1,6}\s+/, '');
}

export default function FormattedAssistantMessage({
    content,
}: FormattedAssistantMessageProps) {
    const lines = normalizeMessage(content);

    return (
        <View>
            {lines.map((rawLine, index) => {
                const line = rawLine.trim();

                if (!line) {
                    return (
                        <View
                            key={`space-${index}`}
                            className="h-2"
                        />
                    );
                }

                const bulletMatch = line.match(
                    /^[-*•]\s+(.+)$/,
                );

                if (bulletMatch) {
                    return (
                        <View
                            key={`bullet-${index}`}
                            className="mb-2 flex-row items-start"
                        >
                            <View
                                className="mr-3 mt-[9px] h-1.5 w-1.5 rounded-full"
                                style={{
                                    backgroundColor:
                                        colors.primary[700],
                                }}
                            />

                            <View className="flex-1">
                                <InlineFormattedText
                                    value={bulletMatch[1]}
                                />
                            </View>
                        </View>
                    );
                }

                const numberedMatch = line.match(
                    /^(\d+)[.)]\s+(.+)$/,
                );

                if (numberedMatch) {
                    return (
                        <View
                            key={`number-${index}`}
                            className="mb-2 flex-row items-start"
                        >
                            <Text
                                className="mr-2 font-inter-semibold text-[16px]"
                                style={{
                                    color: colors.primary[700],
                                    lineHeight: 24,
                                }}
                            >
                                {numberedMatch[1]}.
                            </Text>

                            <View className="flex-1">
                                <InlineFormattedText
                                    value={numberedMatch[2]}
                                />
                            </View>
                        </View>
                    );
                }

                const isHeading =
                    /^#{1,6}\s+/.test(line);

                const cleanedLine =
                    removeMarkdownHeading(line);

                if (isHeading) {
                    return (
                        <Text
                            key={`heading-${index}`}
                            selectable
                            className="mb-2 font-inter-semibold text-[17px]"
                            style={{
                                color: colors.text[700],
                                lineHeight: 25,
                            }}
                        >
                            {cleanedLine}
                        </Text>
                    );
                }

                return (
                    <View
                        key={`paragraph-${index}`}
                        className="mb-1"
                    >
                        <InlineFormattedText
                            value={cleanedLine}
                        />
                    </View>
                );
            })}
        </View>
    );
}