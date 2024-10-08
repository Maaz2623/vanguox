import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useSettingsModalStore = () => {
  return useAtom(modalState);
};
