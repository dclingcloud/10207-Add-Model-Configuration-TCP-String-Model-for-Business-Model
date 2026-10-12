import React, { useState, useRef, useEffect } from 'react';
import { FIELD_CATEGORIES, FieldCategory } from '../types';
import { Search } from 'lucide-react';

interface FieldCategorySelectProps {
  value: FieldCategory;
  onChange: (value: FieldCategory) => void;
  className?: string;
}

export const FieldCategorySelect: React.FC<FieldCategorySelectProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
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

  // Scroll active item into view on open
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen]);

  const filtered = FIELD_CATEGORIES.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger Button - Styled matching Figure 4 & User Screenshot */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-7 min-w-[76px] px-2 bg-white hover:bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 font-medium flex items-center justify-between gap-1.5 focus:outline-none focus:border-blue-500 cursor-pointer select-none transition-colors shadow-2xs"
      >
        <span className="truncate">{value || '普通号'}</span>
        <span className="text-[10px] text-slate-400 font-sans transform transition-transform duration-150">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown Menu - Exact layout & dark styling from User Screenshot */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-36 bg-[#1a2e3e] border border-[#2b4c66] rounded-md shadow-xl py-1 z-50 text-xs text-white overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Quick Filter Search */}
          <div className="px-2 py-1 border-b border-[#29465e]/60 flex items-center gap-1 bg-[#152533]">
            <Search className="w-3 h-3 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索参数分类..."
              className="w-full bg-transparent text-[11px] text-slate-200 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Scrollable list containing all 41 items */}
          <div
            ref={listRef}
            className="max-h-56 overflow-y-auto py-0.5 scrollbar-thin scrollbar-thumb-[#3e6484] scrollbar-track-transparent"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#456d8f #1a2e3e',
            }}
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-[11px] text-slate-400 text-center">
                未找到匹配参数
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = item === value;
                return (
                  <button
                    key={item}
                    type="button"
                    data-selected={isSelected}
                    onClick={() => {
                      onChange(item);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#295677] text-white font-medium'
                        : 'text-slate-200 hover:bg-[#223f54] hover:text-white'
                    }`}
                  >
                    <span>{item}</span>
                    {isSelected && (
                      <span className="text-[10px] text-blue-300">✓</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
