import { create } from 'zustand';
import { UploadDocumentPayload } from '@/types/document';
import { uploadDocumentApi, pollExtractedFields } from '@/lib/api';

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

interface DocumentState {
  categoryId: number | null;
  selectedOption: 'camera' | 'library' | 'browse' | null;
  imageUri: string | null;
  fileName: string | null;
  documentTitle: string;
  documentDate: string;

  uploadStatus: UploadStatus;
  processingStep: number;
  errorMessage: string | null;

  setCategoryId: (id: number | null) => void;
  setSelectedOption: (option: 'camera' | 'library' | 'browse' | null) => void;
  setImageUri: (uri: string | null) => void;
  setFileName: (name: string | null) => void;
  setDocumentTitle: (title: string) => void;
  setDocumentDate: (date: string) => void;

  setUploadStatus: (status: UploadStatus) => void;
  setProcessingStep: (step: number) => void;

  startUploadAndExtraction: (payload: UploadDocumentPayload) => Promise<void>;

  resetUploadState: () => void;
  reset: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  categoryId: 1,
  selectedOption: 'camera',
  imageUri: null,
  fileName: null,
  documentTitle: '',
  documentDate: '',

  uploadStatus: 'idle',
  processingStep: 0,
  errorMessage: null,

  setCategoryId: (id) => set({ categoryId: id }),
  setSelectedOption: (option) => set({ selectedOption: option }),
  setImageUri: (uri) => set({ imageUri: uri }),
  setFileName: (name) => set({ fileName: name }),
  setDocumentTitle: (title) => set({ documentTitle: title }),
  setDocumentDate: (date) => set({ documentDate: date }),

  setUploadStatus: (status) => set({ uploadStatus: status }),
  setProcessingStep: (step) => set({ processingStep: step }),

  startUploadAndExtraction: async (payload: UploadDocumentPayload) => {
    set({ uploadStatus: 'uploading', processingStep: 0, errorMessage: null });

    try {
      await new Promise((res) => setTimeout(res, 800));
      set({ processingStep: 1 });

      const documentId = await uploadDocumentApi(payload);

      set({ processingStep: 2 });

      await new Promise((res) => setTimeout(res, 600));
      set({ processingStep: 3 });

      await pollExtractedFields(documentId);

      set({ processingStep: 4, uploadStatus: 'success' });
    } catch (err: any) {
      set({
        uploadStatus: 'error',
        errorMessage: err?.message || 'Failed to upload document to API',
      });
    }
  },

  resetUploadState: () =>
    set({
      uploadStatus: 'idle',
      processingStep: 0,
      errorMessage: null,
    }),

  reset: () =>
    set({
      categoryId: 1,
      selectedOption: 'camera',
      imageUri: null,
      fileName: null,
      documentTitle: '',
      documentDate: '',
      uploadStatus: 'idle',
      processingStep: 0,
      errorMessage: null,
    }),
}));
