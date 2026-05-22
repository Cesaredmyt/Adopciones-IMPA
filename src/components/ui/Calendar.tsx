"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={`p-2 ${className || ""}`}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold text-impa-text",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-8 w-8 rounded-lg bg-white text-impa-muted shadow-impa-xs ring-1 ring-impa-line transition hover:bg-impa-50 hover:text-impa-700",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-impa-700 rounded-md w-9 font-semibold text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm rounded-md w-9 h-9 p-0 relative focus-within:relative focus-within:z-20",
        day: "h-9 w-9 rounded-lg p-0 font-medium text-impa-text transition hover:bg-impa-50 hover:text-impa-700 aria-selected:opacity-100",
        day_selected:
          "bg-impa-500 text-white shadow-impa-sm hover:bg-impa-600 focus:bg-impa-600",
        day_today: "bg-impa-50 text-impa-700 ring-1 ring-impa-200",
        day_disabled: "text-impa-subtle opacity-40",
        day_outside: "text-impa-subtle opacity-45",
        ...classNames,
      }}
      components={{
        // Adaptacion para versiones nuevas de react-day-picker.
        Chevron: ({ orientation }: { orientation: "left" | "right" }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
