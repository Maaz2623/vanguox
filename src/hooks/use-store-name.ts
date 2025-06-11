import { create } from "zustand";

interface StoreNameState {
  storeName: string;
  setStoreName: (name: string) => void;
}

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export const useStoreName = create<StoreNameState>((set) => ({
  storeName: frameworks[0].label,
  setStoreName: (name: string) => set({ storeName: name }),
}));
