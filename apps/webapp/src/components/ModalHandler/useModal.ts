import { ReactNode } from "react";
import { create } from "zustand";

interface ModalState {
  open: boolean;
  title?: ReactNode;
  content?: ReactNode;
  close: () => void;
  setOpenModal: (val: { title: ReactNode; content: ReactNode }) => void;
}

export const useModalState = create<ModalState>((set) => ({
  open: false,
  title: null,
  content: null,
  close: () => set({ open: false, content: null }),
  setOpenModal: (val) => set({ open: true, ...val }),
}));

const useModal = () => {
  return useModalState.getState().setOpenModal;
};

export default useModal;
