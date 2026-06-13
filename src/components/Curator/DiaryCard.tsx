'use client';

import { HydratedDiaryEntry } from '@/types';
import { Star, BookmarkPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DiaryCardProps {
  entry: HydratedDiaryEntry;
  isPinned: boolean;
  canPin: boolean;
  onPin: (cocktailId: string) => void;
}

export function DiaryCard({ entry, isPinned, canPin, onPin }: DiaryCardProps) {
  const dateObj = new Date(entry.created_at);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const cocktailName = entry.cocktail.name;
  const thumbnailUrl = entry.cocktail.thumbnail_url;

  return (
    <div className="p-3 bg-stone-900/40 border border-stone-800/60 rounded-lg flex flex-col relative group">
      {/* DIALOG TRIGGERS ON TOP HALF ONLY */}
      <Dialog>
        <DialogTrigger render={<div role="button" tabIndex={0} className="flex flex-col cursor-pointer flex-1 outline-none" />}>
            <div className="aspect-square w-full bg-stone-900 rounded-md overflow-hidden mb-3 border border-stone-800/80">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt={cocktailName} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-900/50">
                  <Star className="w-6 h-6 text-stone-700" />
                </div>
              )}
            </div>
            
            <h3 className="font-serif text-stone-200 text-sm tracking-wide line-clamp-1 mb-1">{cocktailName}</h3>
            
            {entry.rating > 0 && (
              <div className="flex items-center gap-0.5 mb-1 opacity-50">
                {[...Array(entry.rating)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" fill="currentColor" />
                ))}
              </div>
            )}
            
            <span className="text-[10px] uppercase tracking-widest text-stone-500 mb-3">{formattedDate}</span>
        </DialogTrigger>
        
        <DialogContent className="bg-[#1A1C19] border-stone-800 sm:max-w-md w-[95vw] rounded-2xl p-0 text-stone-200 overflow-hidden flex flex-col shadow-2xl">
          {thumbnailUrl && (
            <div className="w-full h-48 relative shrink-0">
              <img src={thumbnailUrl} alt={cocktailName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C19] to-transparent"></div>
            </div>
          )}
          <div className="p-8">
            <DialogHeader className={thumbnailUrl ? 'mt-[-30px] relative z-10 text-left mb-6' : 'text-left mb-6'}>
              <DialogTitle className="font-serif text-3xl tracking-wide text-stone-100">{cocktailName}</DialogTitle>
              <div className="flex items-center justify-between w-full mt-2">
                <span className="text-xs font-sans tracking-widest uppercase text-stone-500">{formattedDate}</span>
                {entry.rating > 0 && (
                  <div className="flex items-center gap-1">
                    {[...Array(entry.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" fill="currentColor" />
                    ))}
                  </div>
                )}
              </div>
            </DialogHeader>

            {entry.note && (
              <div className="border-l border-amber-500/30 pl-4 py-1 mt-6">
                <p className="font-serif text-stone-300 text-sm leading-relaxed italic">
                  "{entry.note}"
                </p>
              </div>
            )}
            
            {!entry.note && entry.rating === 0 && (
              <p className="text-sm font-sans text-stone-500 italic">Saved to diary without a note.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* BUTTON COMPLETELY OUTSIDE DIALOG TRIGGER */}
      {!isPinned ? (
        <button 
          onClick={() => onPin(entry.cocktail_id)}
          disabled={!canPin}
          type="button"
          className={`mt-auto w-full py-1.5 px-2 flex items-center justify-center gap-1.5 text-[10px] tracking-widest uppercase rounded border transition-colors ${canPin ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20 hover:border-amber-500/50' : 'bg-stone-900 border-stone-800 text-stone-600 opacity-50 cursor-not-allowed'}`}
        >
          <BookmarkPlus className="w-3 h-3" />
          Pin to Shelf
        </button>
      ) : (
        <div className="mt-auto w-full py-1.5 px-2 flex items-center justify-center gap-1.5 text-[10px] tracking-widest uppercase rounded border border-amber-500/10 text-amber-500/50 bg-transparent cursor-default">
          <Star className="w-3 h-3" />
          Pinned
        </div>
      )}
    </div>
  );
}
