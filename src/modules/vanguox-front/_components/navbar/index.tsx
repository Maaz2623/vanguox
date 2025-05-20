import Image from "next/image";
import React from "react";
import { NavStoreButton } from "./nav-store-button";
import { NavUserButton } from "./nav-user-button";

export const Navbar = () => {
  return (
    <div className="border-b px-3 py-5 flex justify-between items-center">
      <Image
        src="/logo.svg"
        height={150}
        width={150}
        alt="logo"
        priority
        className="w-[150px] h-auto"
      />

      <div />

      <div className="flex justify-center items-center gap-x-3">
        <NavStoreButton />
        <NavUserButton />
      </div>
    </div>
  );
};
