"use client";
import { SearchIcon, XCircleIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";

export const SearchBar = () => {
  const [text, setText] = useState("");

  return (
    <div className="">
      <div className="flex relative bg-gray-50 justify-center border px-2 py-1 rounded-lg items-center">
        <SearchIcon className="size-5" />
        <Input
          placeholder="Search for product or shops"
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="border-none shadow-none focus-visible:outline-none focus-visible:ring-0"
        />
        {text.length > 0 && (
          <XCircleIcon
            onClick={() => setText("")}
            className="size-5 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};
