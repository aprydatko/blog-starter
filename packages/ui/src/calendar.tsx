"use client"

import "react-day-picker/style.css";

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

export interface CalendarProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  fromYear?: number
  toYear?: number
  showTimeSelect?: boolean
}

export function Calendar({
  className,
  selected,
  onSelect,
  disabled = false,
  placeholder = "Pick a date",
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10,
  showTimeSelect = false,
  ...props
}: CalendarProps) {
  const [time, setTime] = React.useState<string>(
    selected ? format(selected, "HH:mm") : "00:00"
  )

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    
    if (selected) {
      const [hours, minutes] = newTime.split(":")
      const newDate = new Date(selected)
      newDate.setHours(parseInt(hours!, 10))
      newDate.setMinutes(parseInt(minutes!, 10))
      onSelect(newDate)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onSelect(undefined)
      return
    }

    if (showTimeSelect && time) {
      const [hours, minutes] = time.split(":")
      date.setHours(parseInt(hours!, 10))
      date.setMinutes(parseInt(minutes!, 10))
    }
    
    onSelect(date)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? (
            format(selected, "PPP" + (showTimeSelect ? " HH:mm" : ""))
          ) : (
            <span>{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={handleDateSelect}
          disabled={disabled}
          initialFocus
          fromYear={fromYear}
          toYear={toYear}
          captionLayout="dropdown"
          className="rounded-md border"
          classNames={{
            dropdown: "bg-background",
            dropdown_year: "bg-background",
            button: cn(
              buttonVariants({ variant: "ghost" }),
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
            ),
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_hidden: "invisible",
            ...(typeof className === 'object' ? className : {}),
          }}
          components={{
            Nav: ({ onPreviousClick, onNextClick }) => (
              <div className="flex">
                <button
                  type="button"
                  onClick={onPreviousClick}
                  className="p-2 text-lg"
                  aria-label="Previous month"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={onNextClick}
                  className="p-2 text-lg"
                  aria-label="Next month"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            )
          }}
        />
        {showTimeSelect && (
          <div className="border-t p-2 flex items-center justify-center">
            <input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="bg-background border rounded px-2 py-1 text-sm"
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

Calendar.displayName = "Calendar"
