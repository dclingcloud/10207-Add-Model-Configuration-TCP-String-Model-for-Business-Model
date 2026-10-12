import React, { useState, useRef, useEffect } from 'react';

interface CustomSelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string = string> {
  value: T;
  options: (T | CustomSelectOption<T>)[];
  onChange: (value: T) => void;
  className?: string;
  minWidth?: string;
  dropdownWidth?: string;
}

export function CustomSelect<T extends string = string>({
  value,
  options,
  onChange,
  className = '',
  minWidth = 'min-w-[68px]',
  dropdownWidth = 'w-28',
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const parsedOptions: CustomSelectOption<T>[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt as T, label: opt };
    }
    return opt;
  });

  const currentLabel =
    parsedOptions.find((o) => o.value === value)?.label || String(value);

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger Button - Matches exact layout and up/down caret in screenshot */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-7 ${minWidth} px-2 bg-white hover:bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 font-medium flex items-center justify-between gap-1.5 focus:outline-none focus:border-blue-500 cursor-pointer select-none transition-colors shadow-2xs`}
      >
        <span className="truncate">{currentLabel}</span>
        <span className="text-[9px] text-slate-500 font-mono">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown Menu - Exact dark styling matching user screenshot */}
      {isOpen && (
        <div
          className={`absolute left-0 top-full mt-1 ${dropdownWidth} bg-[#1a2e3e] border border-[#2b4c66] rounded-md shadow-xl py-1 z-50 text-xs text-white overflow-hidden animate-in fade-in zoom-in-95 duration-100`}
        >
          <div className="max-h-56 overflow-y-auto py-0.5 scrollbar-thin scrollbar-thumb-[#3e6484] scrollbar-track-transparent">
            {parsedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#295677] text-white font-medium'
                      : 'text-slate-200 hover:bg-[#223f54] hover:text-white'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <span className="text-[10px] text-blue-300 ml-1">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
