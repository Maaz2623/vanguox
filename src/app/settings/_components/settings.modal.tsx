import React from "react";
import { useSettingsModalStore } from "../_store/use-settings-modal-store";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

const SettingsModal = () => {
  const [open, setOpen] = useSettingsModalStore();

  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter()

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-[80%] w-[fit-content] h-[fit-content]">
        Settings
        <button onClick={() => {
          router.push('/')
        }}>
          Close
        </button>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SettingsModal;
