import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "invite" | "editServer";

interface ModalData {
  server?: Server;
}

interface ModalStore {
  type: ModalType | null;
  data: {};
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}
export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type: ModalType, data?: ModalData) =>
    set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
