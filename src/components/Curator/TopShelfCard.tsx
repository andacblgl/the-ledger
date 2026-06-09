'use client';

import { HydratedTopShelfSlot } from '@/types';
import { Minus } from 'lucide-react';

interface TopShelfCardProps {
  slot: HydratedTopShelfSlot | null;
  onUnpin: (cocktailId: string) => void;
}

export function TopShelfCard({ slot, onUnpin }: TopShelfCardProps) {
  if (!slot) {
    return (
      <div className="flex flex-col">
        <div className="aspect-[2/3] w-full bg-stone-900/40 border border-dashed border-stone-800 rounded-md flex flex-col items-center justify-center group cursor-default p-2 text-center">
          <span className="text-stone-800 text-2xl font-light mb-1">+</span>
          <span className="text-[8px] uppercase tracking-widest text-stone-600 leading-tight">
            Pin your<br />signature
          </span>
        </div>
        <p className="text-xs mt-2 opacity-0 truncate px-1">Placeholder</p>
      </div>
    );
  }

  const { name, thumbnail_url } = slot.cocktail;

  return (
    <div className="flex flex-col group relative">
      <div 
        className="aspect-[2/3] w-full bg-stone-900 rounded-md overflow-hidden relative border border-stone-800 shadow-sm transition-transform duration-300"
        title={name}
      >
        {thumbnail_url ? (
          <img src={thumbnail_url} alt={name} className="w-full h-full object-cover opacity-90 transition-opacity" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900/50 p-2 text-center">
            <span className="text-[10px] font-serif text-stone-400 line-clamp-3 leading-tight">{name}</span>
          </div>
        )}
        
        <button 
          onClick={() => onUnpin(slot.cocktail_id)} 
          type="button" 
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-red-500/80 text-white p-1 rounded-full backdrop-blur-sm border border-white/10"
        >
          <Minus className="w-3 h-3" />
        </button>
      </div>
      <p className="text-xs text-stone-400 mt-2 text-center truncate font-sans tracking-wide px-1">
        {name}
      </p>
    </div>
  );
}
