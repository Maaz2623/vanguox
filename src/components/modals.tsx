"use client";
import SettingsModal from "@/app/settings/_components/settings.modal";
import React, { useEffect, useState } from "react";

const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <SettingsModal />
    </>
  );
};

export default Modals;
