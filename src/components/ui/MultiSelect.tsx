"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import * as React from "react";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select…",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleValue = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center gap-2 rounded border px-3 py-2 text-left text-sm"
        >
          {selected.length > 0 ? (
            <div className="flex gap-1 overflow-x-auto scrollbar-none">
              {selected.map((val) => {
                const opt = options.find((o) => o.value === val)!;
                return (
                  <Badge
                    key={val}
                    onClick={() => toggleValue(val)}
                    className="flex-shrink-0 cursor-pointer"
                  >
                    {opt.label} <span className="ml-1">×</span>
                  </Badge>
                );
              })}
            </div>
          ) : (
            <span className="text-zinc-500">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search…" />
          <CommandList>
            {options.length === 0 && <CommandEmpty>No options</CommandEmpty>}
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => toggleValue(opt.value)}
                  className={cn(
                    "flex justify-between px-2 py-1 cursor-pointer",
                    selected.includes(opt.value) && "font-semibold"
                  )}
                >
                  {opt.label}
                  {selected.includes(opt.value) && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
