import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, Platform, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackButton from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { ListItem } from '@/components/ui/ListItem';
import { ConfirmDetailsModal } from '@/components/ui/ConfirmDetailsModal';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Camera02Icon,
  Image02Icon,
  Folder02Icon,
  Calendar03Icon,
  Upload01Icon,
} from '@hugeicons/core-free-icons';
import { colors } from '@/lib/theme/colors';
import { useDocumentStore } from '@/store/useDocumentStore';

interface FormValues {
  imageUri: string;
  documentTitle: string;
  documentDate: string;
}

export default function AddDetailsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation('add');
  const isRTL = i18n.language === 'ar';

  const categoryId = useDocumentStore((state) => state.categoryId);
  const selectedOption = useDocumentStore((state) => state.selectedOption);
  const imageUri = useDocumentStore((state) => state.imageUri);
  const fileName = useDocumentStore((state) => state.fileName);
  const documentTitle = useDocumentStore((state) => state.documentTitle);
  const documentDate = useDocumentStore((state) => state.documentDate);

  const setSelectedOption = useDocumentStore((state) => state.setSelectedOption);
  const setImageUri = useDocumentStore((state) => state.setImageUri);
  const setFileName = useDocumentStore((state) => state.setFileName);
  const setDocumentTitle = useDocumentStore((state) => state.setDocumentTitle);
  const setDocumentDate = useDocumentStore((state) => state.setDocumentDate);
  const reset = useDocumentStore((state) => state.reset);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      imageUri: imageUri || '',
      documentTitle: documentTitle || '',
      documentDate: documentDate || '',
    },
  });

  useEffect(() => {
    if (imageUri) setValue('imageUri', imageUri);
  }, [imageUri]);

  useEffect(() => {
    if (documentTitle) setValue('documentTitle', documentTitle);
  }, [documentTitle]);

  useEffect(() => {
    if (documentDate) setValue('documentDate', documentDate);
  }, [documentDate]);

  const handlePickCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('details.errors.permissionRequired'), t('details.errors.cameraPermission'));
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const name = result.assets[0].fileName || uri.split('/').pop() || 'photo.jpg';
      setSelectedOption('camera');
      setImageUri(uri);
      setFileName(name);
      setValue('imageUri', uri, { shouldValidate: true });
    }
  };

  const handlePickLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('details.errors.permissionRequired'), t('details.errors.libraryPermission'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const name = result.assets[0].fileName || uri.split('/').pop() || 'image.jpg';
      setSelectedOption('library');
      setImageUri(uri);
      setFileName(name);
      setValue('imageUri', uri, { shouldValidate: true });
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedOption('browse');
        setImageUri(asset.uri);
        setFileName(asset.name);
        setValue('imageUri', asset.uri, { shouldValidate: true });
      }
    } catch (err) {
      // Handled silently
    }
  };

  const startUploadAndExtraction = useDocumentStore((state) => state.startUploadAndExtraction);

  const onFormSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    const uriLower = imageUri?.toLowerCase() || '';
    const nameLower = fileName?.toLowerCase() || '';

    const isPdf = uriLower.endsWith('.pdf') || nameLower.endsWith('.pdf') || uriLower.includes('.pdf') || nameLower.includes('.pdf');
    const isPng = uriLower.endsWith('.png') || nameLower.endsWith('.png') || uriLower.includes('.png') || nameLower.includes('.png');
    const isWebp = uriLower.endsWith('.webp') || nameLower.endsWith('.webp') || uriLower.includes('.webp') || nameLower.includes('.webp');
    const isHeic = uriLower.endsWith('.heic') || nameLower.endsWith('.heic') || uriLower.includes('.heic') || nameLower.includes('.heic');

    let mimeType = 'image/jpeg';
    let fileExtension = '.jpg';

    if (isPdf) {
      mimeType = 'application/pdf';
      fileExtension = '.pdf';
    } else if (isPng) {
      mimeType = 'image/png';
      fileExtension = '.png';
    } else if (isWebp) {
      mimeType = 'image/webp';
      fileExtension = '.webp';
    } else if (isHeic) {
      mimeType = 'image/heic';
      fileExtension = '.heic';
    }

    let finalName = fileName || (imageUri ? imageUri.split('/').pop() || `document${fileExtension}` : `document${fileExtension}`);
    if (!finalName.toLowerCase().endsWith(fileExtension)) {
      finalName = finalName + fileExtension;
    }

    const documentType = categoryId === 1 ? 'Medical Tests' : 'Medical Radiation';

    let formattedDate = documentDate;
    if (documentDate && documentDate.includes('/')) {
      const parts = documentDate.split('/');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    const requestPayload = {
      file: {
        uri: imageUri || '',
        name: finalName,
        type: mimeType,
      },
      documentType,
      title: documentTitle,
      documentDate: formattedDate,
    };

    setShowConfirmModal(false);
    startUploadAndExtraction(requestPayload);

    router.push('/add/processing');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setPickerDate(selectedDate);
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const yyyy = selectedDate.getFullYear();
      const formatted = `${dd}/${mm}/${yyyy}`;
      setDocumentDate(formatted);
      setValue('documentDate', formatted, { shouldValidate: true });
    }
  };

  const CalendarInputIcon = ({ size = 20 }: { size?: number }) => (
    <HugeiconsIcon icon={Calendar03Icon} size={size} color={colors.primary[800]} />
  );

  return (
    <SafeAreaView className="flex-1 bg-bg px-6 pt-4" edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        <View className={`flex-row ${isRTL ? 'justify-end' : 'justify-start'} mb-6`}>
          <BackButton onPress={() => router.back()} />
        </View>

        <Text className={`text-[24px] font-jakarta-bold text-primary-900 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('details.title')}
        </Text>
        <Text className={`text-[16px] font-jakarta-regular text-bg-800 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('details.subtitle')}
        </Text>

        <ListItem
          title={t('details.takePhotoTitle')}
          body={selectedOption === 'camera' && imageUri ? (fileName || t('details.takePhotoSelected')) : t('details.takePhotoDefault')}
          leftIcon={<HugeiconsIcon icon={Camera02Icon} size={24} color={colors.secondary[800]} />}
          iconBgColor="bg-secondary-50"
          selected={selectedOption === 'camera' && !!imageUri}
          onPress={handlePickCamera}
        />

        <ListItem
          title={t('details.chooseLibraryTitle')}
          body={selectedOption === 'library' && imageUri ? (fileName || t('details.chooseLibrarySelected')) : t('details.chooseLibraryDefault')}
          leftIcon={<HugeiconsIcon icon={Image02Icon} size={24} color={colors.primary[800]} />}
          iconBgColor="bg-primary-50"
          selected={selectedOption === 'library' && !!imageUri}
          onPress={handlePickLibrary}
        />

        <ListItem
          title={t('details.browseFilesTitle')}
          body={selectedOption === 'browse' && imageUri ? (fileName || t('details.browseFilesSelected')) : t('details.browseFilesDefault')}
          leftIcon={<HugeiconsIcon icon={Folder02Icon} size={24} color={colors.text[800]} />}
          iconBgColor="bg-text-50"
          selected={selectedOption === 'browse' && !!imageUri}
          onPress={handlePickDocument}
        />

        {errors.imageUri && (
          <Text className={`text-xs font-inter-regular text-red-500 mb-2 px-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            {errors.imageUri.message}
          </Text>
        )}

        <Controller
          control={control}
          name="imageUri"
          rules={{ required: t('details.errors.selectFile') }}
          render={() => <View />}
        />

        <View className="mt-4">
          <Controller
            control={control}
            name="documentTitle"
            rules={{ required: t('details.errors.titleRequired') }}
            render={({ field: { onChange, value } }) => (
              <InputField
                label={t('details.documentTitleLabel')}
                placeholder={t('details.documentTitlePlaceholder')}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setDocumentTitle(text);
                }}
                error={errors.documentTitle?.message}
                containerClassName="mb-4"
                bgClassName="bg-primary-50"
              />
            )}
          />

          <Controller
            control={control}
            name="documentDate"
            rules={{ required: t('details.errors.dateRequired') }}
            render={({ field: { value } }) => (
              <Pressable onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                  <InputField
                    label={t('details.documentDateLabel')}
                    placeholder={t('details.documentDatePlaceholder')}
                    value={value}
                    editable={false}
                    rightIcon={CalendarInputIcon}
                    error={errors.documentDate?.message}
                    containerClassName="mb-2"
                    bgClassName="bg-primary-50"
                  />
                </View>
              </Pressable>
            )}
          />

          <Text className="text-[12px] font-jakarta-medium text-text2-400 text-center my-4">
            {t('details.supportedFormats')}
          </Text>
        </View>

        <View className="mt-auto pt-2">
          <Button
            title={t('details.uploadButton')}
            variant="primary"
            rightIcon={<HugeiconsIcon icon={Upload01Icon} size={20} color="#FFFFFF" />}
            onPress={handleSubmit(onFormSubmit)}
          />
        </View>
      </ScrollView>

      {showDatePicker && (
        Platform.OS === 'ios' ? (
          <Modal transparent animationType="fade" visible={showDatePicker}>
            <View className="flex-1 justify-end bg-black/40">
              <View className="bg-white p-4 rounded-t-3xl border-t border-gray-100">
                <View className={`flex-row ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between items-center mb-2 px-2`}>
                  <Text className="text-base font-jakarta-bold text-primary-900">{t('details.selectDateHeader')}</Text>
                  <Pressable onPress={() => setShowDatePicker(false)}>
                    <Text className="text-base font-jakarta-semibold text-primary-900">{t('details.dateDone')}</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={pickerDate}
                  mode="date"
                  display="spinner"
                  textColor="#1F2937"
                  accentColor={colors.primary[900]}
                  maximumDate={new Date()}
                  onValueChange={handleDateChange}
                  onDismiss={() => setShowDatePicker(false)}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display="default"
            accentColor={colors.primary[900]}
            maximumDate={new Date()}
            positiveButton={{ label: t('details.dateOk'), textColor: colors.primary[900] }}
            negativeButton={{ label: t('details.dateCancel'), textColor: colors.text2[600] }}
            onValueChange={handleDateChange}
            onDismiss={() => setShowDatePicker(false)}
          />
        )
      )}

      <ConfirmDetailsModal
        visible={showConfirmModal}
        imageUri={imageUri}
        fileName={fileName}
        documentTitle={documentTitle}
        documentDate={documentDate}
        onConfirm={handleFinalConfirm}
        onBackToEdit={() => setShowConfirmModal(false)}
      />
    </SafeAreaView>
  );
}
