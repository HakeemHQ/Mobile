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
import { useTranslation } from 'react-i18next';

import { colors } from '@/lib/theme/colors';
import {
    getProfileFieldKeyboardType,
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

const FIELD_TRANSLATION_KEYS: Record<
    EditableProfileField,
    {
        title: string;
        placeholder: string;
    }
> = {
    firstName: {
        title: 'profileComponents.editFieldModal.titles.firstName',
        placeholder: 'profileComponents.editFieldModal.placeholders.firstName',
    },
    lastName: {
        title: 'profileComponents.editFieldModal.titles.lastName',
        placeholder: 'profileComponents.editFieldModal.placeholders.lastName',
    },
    email: {
        title: 'profileComponents.editFieldModal.titles.email',
        placeholder: 'profileComponents.editFieldModal.placeholders.email',
    },
    phoneNumber: {
        title: 'profileComponents.editFieldModal.titles.phoneNumber',
        placeholder: 'profileComponents.editFieldModal.placeholders.phoneNumber',
    },
};

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
    const { t, i18n } = useTranslation('profile');
    const isRTL = i18n.language === 'ar';
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
                        <View className={`mb-5 flex-row items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Text className={`font-jakarta-bold text-[20px] text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {field
                                    ? t(FIELD_TRANSLATION_KEYS[field].title)
                                    : ''}
                            </Text>

                            <Pressable
                                accessibilityLabel={t('profileComponents.editFieldModal.closeAccessibility')}
                                accessibilityRole="button"
                                className={`h-9 items-center justify-center px-2 ${isSaving ? 'opacity-50' : ''
                                    }`}
                                disabled={isSaving}
                                onPress={handleClose}
                            >
                                <Text className="font-jakarta-semibold text-[13px] text-text2-500">
                                    {t('profileComponents.editFieldModal.cancel')}
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
                            className={`h-14 rounded-[18px] border border-bg-600 bg-bg px-4 font-inter-regular text-[14px] text-text-500 ${isRTL ? 'text-right' : 'text-left'}`}
                            editable={!isSaving}
                            keyboardType={getProfileFieldKeyboardType(
                                field,
                            )}
                            placeholder={
                                field
                                    ? t(FIELD_TRANSLATION_KEYS[field].placeholder)
                                    : ''
                            }
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
                            <Text className={`${isRTL ? 'mr-1 text-right' : 'ml-1 text-left'} mt-2 font-inter-regular text-[12px] text-red-600`}>
                                {validationError}
                            </Text>
                        ) : null}

                        {saveError ? (
                            <Text className={`${isRTL ? 'mr-1 text-right' : 'ml-1 text-left'} mt-2 font-inter-regular text-[12px] text-red-600`}>
                                {saveError}
                            </Text>
                        ) : null}

                        <Pressable
                            accessibilityRole="button"
                            className={`mt-6 h-14 items-center justify-center rounded-[28px] bg-primary ${isSaving ? 'opacity-70' : ''
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
                                    {t('profileComponents.editFieldModal.saveChanges')}
                                </Text>
                            )}
                        </Pressable>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
}