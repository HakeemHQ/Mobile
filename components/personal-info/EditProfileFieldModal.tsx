import {
    useEffect,
    useState,
} from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';

import { colors } from '@/lib/theme/colors';
import {
    getProfileFieldKeyboardType,
    getProfileFieldPlaceholder,
    PROFILE_FIELD_TITLES,
    validateProfileField,
} from '@/lib/profile-utils';
import type { EditableProfileField } from '@/types/profile';

interface EditProfileFieldModalProps {
    visible: boolean;
    field: EditableProfileField | null;
    initialValue: string;
    isSaving: boolean;
    saveError: string;
    onClose: () => void;
    onSave: (value: string) => Promise<boolean>;
    onClearSaveError: () => void;
}

export function EditProfileFieldModal({
    visible,
    field,
    initialValue,
    isSaving,
    saveError,
    onClose,
    onSave,
    onClearSaveError,
}: EditProfileFieldModalProps) {
    const [draftValue, setDraftValue] = useState('');
    const [validationError, setValidationError] =
        useState('');

    useEffect(() => {
        if (!visible || !field) {
            return;
        }

        setDraftValue(initialValue);
        setValidationError('');
    }, [field, initialValue, visible]);

    const handleClose = () => {
        if (isSaving) {
            return;
        }

        setValidationError('');
        onClearSaveError();
        onClose();
    };

    const handleSave = async () => {
        if (!field || isSaving) {
            return;
        }

        const cleanedValue = draftValue.trim();
        const errorMessage = validateProfileField(
            field,
            cleanedValue,
        );

        if (errorMessage) {
            setValidationError(errorMessage);
            return;
        }

        setValidationError('');
        await onSave(cleanedValue);
    };

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={
                    Platform.OS === 'ios' ? 'padding' : 'height'
                }
                className="flex-1"
            >
                <Pressable
                    className="flex-1 justify-end bg-black/30"
                    onPress={handleClose}
                >
                    <Pressable
                        className="rounded-t-[32px] bg-surface px-6 pb-8 pt-5"
                        onPress={(event) => event.stopPropagation()}
                    >
                        <View className="mb-5 flex-row items-center justify-between">
                            <Text className="font-jakarta-bold text-[20px] text-primary-900">
                                {field
                                    ? PROFILE_FIELD_TITLES[field]
                                    : ''}
                            </Text>

                            <Pressable
                                accessibilityLabel="Close profile editor"
                                accessibilityRole="button"
                                className={`h-9 items-center justify-center px-2 ${isSaving ? 'opacity-50' : ''
                                    }`}
                                disabled={isSaving}
                                onPress={handleClose}
                            >
                                <Text className="font-jakarta-semibold text-[13px] text-text2-500">
                                    Cancel
                                </Text>
                            </Pressable>
                        </View>

                        <TextInput
                            autoCapitalize={
                                field === 'email' ||
                                    field === 'phoneNumber'
                                    ? 'none'
                                    : 'words'
                            }
                            autoCorrect={false}
                            autoFocus
                            className="h-14 rounded-[18px] border border-bg-600 bg-bg px-4 font-inter-regular text-[14px] text-text-500"
                            editable={!isSaving}
                            keyboardType={getProfileFieldKeyboardType(
                                field,
                            )}
                            placeholder={getProfileFieldPlaceholder(
                                field,
                            )}
                            placeholderTextColor={colors.text2[200]}
                            returnKeyType="done"
                            value={draftValue}
                            onChangeText={(value) => {
                                setDraftValue(value);
                                setValidationError('');
                                onClearSaveError();
                            }}
                            onSubmitEditing={() => {
                                void handleSave();
                            }}
                        />

                        {validationError ? (
                            <Text className="ml-1 mt-2 font-inter-regular text-[12px] text-red-600">
                                {validationError}
                            </Text>
                        ) : null}

                        {saveError ? (
                            <Text className="ml-1 mt-2 font-inter-regular text-[12px] text-red-600">
                                {saveError}
                            </Text>
                        ) : null}

                        <Pressable
                            accessibilityRole="button"
                            className={`mt-6 h-14 items-center justify-center rounded-[28px] bg-primary-900 ${isSaving ? 'opacity-70' : ''
                                }`}
                            disabled={isSaving}
                            onPress={() => {
                                void handleSave();
                            }}
                        >
                            {isSaving ? (
                                <ActivityIndicator
                                    color={colors.surface.DEFAULT}
                                />
                            ) : (
                                <Text className="font-jakarta-semibold text-[15px] text-surface">
                                    Save Changes
                                </Text>
                            )}
                        </Pressable>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
}