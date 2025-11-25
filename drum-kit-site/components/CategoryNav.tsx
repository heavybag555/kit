'use client';

import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const CATEGORIES = ['kicks', 'snares', 'hats', 'percs', 'vox', 'background'];

export function CategoryNav() {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <nav className="flex gap-4 overflow-x-auto pb-2 mb-6 border-b border-gray-100 scrollbar-hide">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap",
            selectedCategory === category
              ? "bg-black text-white"
              : "text-gray-500 hover:bg-gray-100"
          )}
        >
          {category}
        </button>
      ))}
    </nav>
  );
}

