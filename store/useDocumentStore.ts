import { create } from 'zustand';

interface DocumentState {
  categoryId: number | null;
  selectedOption: 'camera' | 'library' | 'browse' | null;
  imageUri: string | null;
  fileName: string | null;
  documentTitle: string;
  documentDate: string;
  setCategoryId: (id: number | null) => void;
  setSelectedOption: (option: 'camera' | 'library' | 'browse' | null) => void;
  setImageUri: (uri: string | null) => void;
  setFileName: (name: string | null) => void;
  setDocumentTitle: (title: string) => void;
  setDocumentDate: (date: string) => void;
  reset: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  categoryId: 1,
  selectedOption: 'camera',
  imageUri: null,
  fileName: null,
  documentTitle: '',
  documentDate: '',
  setCategoryId: (id) => set({ categoryId: id }),
  setSelectedOption: (option) => set({ selectedOption: option }),
  setImageUri: (uri) => set({ imageUri: uri }),
  setFileName: (name) => set({ fileName: name }),
  setDocumentTitle: (title) => set({ documentTitle: title }),
  setDocumentDate: (date) => set({ documentDate: date }),
  reset: () =>
    set({
      categoryId: 1,
      selectedOption: 'camera',
      imageUri: null,
      fileName: null,
      documentTitle: '',
      documentDate: '',
    }),
}));
