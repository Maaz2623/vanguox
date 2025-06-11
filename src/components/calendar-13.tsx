"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
export default function Calendar13({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) {
  const [dropdown] =
    React.useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    );

  console.log(date);

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        captionLayout={dropdown}
        className="rounded-lg border shadow-sm"
      />
    </div>
  );
}
