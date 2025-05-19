import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSubdomainClient(hostname: string): string | null {
  const parts = hostname.split(".");
  if (parts.length < 3) return null;

  return parts[0];
}
