import React from "react";
import { useSettingsModalStore } from "../store/use-settings-modal-store";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

const SettingsModal = () => {
  const [open, setOpen] = useSettingsModalStore();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-[80%] w-[fit-content] h-[fit-content]">
        Settings
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SettingsModal;
