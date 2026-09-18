import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchToolbar({
  searchQuery,
  onSearchChange,
  onClearSearch
}) {
  return (
    <section className="bg-theme-card border border-theme-border rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-card-dark flex items-center">
      {/* Search Input Box */}
      <div className="relative flex-1 group">
        <Search
          className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-theme-textMuted group-focus-within:text-rose-400 transition-colors"
        />
        <input
          type="text"
          placeholder="Search tickets by ID, name, email, or issue keywords..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 sm:pl-10 pr-8 sm:pr-9 py-2 sm:py-2.5 text-xs sm:text-sm bg-theme-dark border border-theme-border rounded-lg sm:rounded-xl outline-none text-white placeholder:text-theme-textMuted transition focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20"
        />
        {searchQuery && (
          <button
            type="button"
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-theme-textMuted hover:text-white p-1 rounded transition cursor-pointer"
            onClick={onClearSearch}
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </section>
  );
}

