'use client';

import { useState } from 'react';
import { HydratedDiaryEntry } from '@/types';
import { Star, BookmarkPlus, Trash2, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DiaryCardProps {
  entries: HydratedDiaryEntry[];
  isPinned: boolean;
  canPin: boolean;
  onPin: (cocktailId: string) => void;
  onUpdate?: (bookmarkId: string, rating: number, note: string, is_first_time: boolean) => Promise<void>;
  onDelete?: (bookmarkId: string) => Promise<void>;
}

function LogItem({ 
  log, 
  onUpdate, 
  onDelete 
}: { 
  log: HydratedDiaryEntry; 
  onUpdate?: (id: string, rating: number, note: string, is_first_time: boolean) => Promise<void>; 
  onDelete?: (id: string) => Promise<void>; 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(log.rating);
  const [note, setNote] = useState(log.note || '');
  const [isFirstTime, setIsFirstTime] = useState(log.is_first_time ?? false);
  const [isSaving, setIsSaving] = useState(false);

  const dateObj = new Date(log.created_at);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleSave = async () => {
      if (!onUpdate) return;
      setIsSaving(true);
      await onUpdate(log.id, rating, note, isFirstTime);
      setIsSaving(false);
      setIsEditing(false);
  };

  const handleDelete = async () => {
      if (!onDelete) return;
      if (window.confirm('Are you sure you want to delete this log?')) {
          setIsSaving(true);
          await onDelete(log.id);
          setIsSaving(false);
      }
  };

  if (isEditing) {
      return (
          <div className="p-5 bg-stone-900 border border-stone-800 rounded-lg mb-2 mt-2">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800/60">
                  <span className="text-xs font-sans tracking-widest uppercase text-stone-500">Edit Log</span>
                  <button onClick={() => setIsEditing(false)} className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-300 transition-colors">Cancel</button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                      <button 
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform active:scale-90"
                      >
                          <Star 
                              className={`w-4 h-4 transition-colors ${rating >= star ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]' : 'text-stone-700 hover:text-stone-500'}`} 
                              fill={rating >= star ? "currentColor" : "none"}
                          />
                      </button>
                  ))}
              </div>

              <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Log your tasting experience..."
                  className="w-full bg-[#1A1C19]/50 border border-stone-800 rounded-lg p-3 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-stone-600 transition-colors mb-4 resize-none h-20 font-serif"
              />

              <label className="flex items-center gap-2 mb-6 cursor-pointer group w-fit">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isFirstTime ? 'bg-amber-500 border-amber-500' : 'bg-[#1A1C19] border-stone-700 group-hover:border-stone-500'}`}>
                      {isFirstTime && <svg className="w-3 h-3 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-xs font-sans tracking-wide text-stone-400 group-hover:text-stone-300 transition-colors">First-time taste</span>
              </label>

              <div className="flex items-center gap-2">
                  <button 
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 py-2 px-4 bg-[#1A1C19] border border-stone-800 hover:border-stone-600 text-stone-300 font-sans tracking-wide uppercase text-[10px] rounded shadow-sm transition-all flex items-center justify-center disabled:opacity-50"
                  >
                      {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  
                  <button 
                      type="button"
                      onClick={handleDelete}
                      disabled={isSaving}
                      className="py-2 px-3 text-red-500/80 hover:text-red-400 hover:bg-red-500/10 font-sans tracking-wide uppercase text-[10px] rounded border border-transparent hover:border-red-500/20 transition-all flex items-center justify-center disabled:opacity-50"
                  >
                      <Trash2 className="w-3.5 h-3.5" />
                  </button>
              </div>
          </div>
      );
  }

  return (
      <div className="py-5 px-6 border-b border-stone-800/60 last:border-0 hover:bg-stone-900/20 transition-colors group">
          <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                      <span className="text-[10px] font-sans tracking-widest uppercase text-stone-500">{formattedDate}</span>
                      {log.is_first_time && (
                          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded px-1.5 py-0.5 text-[8px] uppercase tracking-widest shadow-sm">
                              First Taste
                          </span>
                      )}
                  </div>
                  {log.rating > 0 && (
                      <div className="flex items-center gap-0.5">
                          {[...Array(log.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-amber-500 drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" fill="currentColor" />
                          ))}
                      </div>
                  )}
              </div>
              <button 
                  onClick={() => setIsEditing(true)} 
                  className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-300 transition-all flex items-center gap-1.5 p-1"
              >
                  <Edit2 className="w-3 h-3" />
                  Edit
              </button>
          </div>
          {log.note && (
              <p className="font-serif text-stone-300 text-sm leading-relaxed italic border-l border-amber-500/20 pl-3 py-0.5">
                  "{log.note}"
              </p>
          )}
          {!log.note && log.rating === 0 && (
             <p className="text-[11px] font-sans text-stone-600 italic mt-2">No notes recorded.</p>
          )}
      </div>
  );
}

export function DiaryCard({ entries, isPinned, canPin, onPin, onUpdate, onDelete }: DiaryCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!entries || entries.length === 0) return null;

  const primaryEntry = entries[0];
  const dateObj = new Date(primaryEntry.created_at);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const cocktailName = primaryEntry.cocktail.name;
  const thumbnailUrl = primaryEntry.cocktail.thumbnail_url;

  return (
    <div className="p-3 bg-stone-900/40 border border-stone-800/60 rounded-lg flex flex-col relative group">
      {/* DIALOG TRIGGERS ON TOP HALF ONLY */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger render={<div role="button" tabIndex={0} className="flex flex-col cursor-pointer flex-1 outline-none" />}>
            <div className="aspect-square w-full bg-stone-900 rounded-md overflow-hidden mb-3 border border-stone-800/80 relative">
              {primaryEntry.is_first_time && (
                  <div className="absolute top-2 right-2 bg-stone-900/80 border border-amber-500/50 text-amber-500 rounded-full px-2 py-0.5 text-[8px] font-sans uppercase tracking-widest backdrop-blur-sm z-10 flex items-center shadow-[0_0_10px_rgba(245,166,35,0.2)]">
                      First Taste
                  </div>
              )}
              {entries.length > 1 && (
                  <div className="absolute top-2 left-2 bg-stone-900/80 border border-stone-700 text-stone-300 rounded-full px-2 py-0.5 text-[8px] font-sans uppercase tracking-widest backdrop-blur-sm z-10 flex items-center">
                      {entries.length} Tastes
                  </div>
              )}
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt={cocktailName} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-900/50">
                  <Star className="w-6 h-6 text-stone-700" />
                </div>
              )}
            </div>
            
            <h3 className="font-serif text-stone-200 text-sm tracking-wide line-clamp-1 mb-1">{cocktailName}</h3>
            
            {primaryEntry.rating > 0 && (
              <div className="flex items-center gap-0.5 mb-1 opacity-50">
                {[...Array(primaryEntry.rating)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" fill="currentColor" />
                ))}
              </div>
            )}
            
            <span className="text-[10px] uppercase tracking-widest text-stone-500 mb-3">Last logged: {formattedDate}</span>
        </DialogTrigger>
        
        <DialogContent className="bg-[#1A1C19] border-stone-800 sm:max-w-md w-[95vw] rounded-2xl p-0 text-stone-200 overflow-hidden flex flex-col shadow-2xl max-h-[85vh]">
          {thumbnailUrl && (
            <div className="w-full h-40 relative shrink-0">
              <img src={thumbnailUrl} alt={cocktailName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C19] via-[#1A1C19]/40 to-transparent"></div>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              <div className={thumbnailUrl ? 'mt-[-30px] relative z-10 text-left px-8 mb-4 shrink-0' : 'text-left px-8 pt-8 mb-4 shrink-0'}>
                <DialogTitle className="font-serif text-3xl tracking-wide text-stone-100 mb-1">{cocktailName}</DialogTitle>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[10px] font-sans tracking-widest uppercase text-stone-500 bg-stone-900 border border-stone-800 px-2 py-1 rounded">
                      {entries.length} {entries.length === 1 ? 'Taste' : 'Tastes'}
                  </span>
                </div>
              </div>

              <div className="border-t border-stone-800/60 mt-2 flex-1 pb-4">
                  <div className="sticky top-0 bg-[#1A1C19]/95 backdrop-blur-md z-20 px-8 py-3 border-b border-stone-800/60 shadow-sm">
                      <h4 className="font-sans text-[10px] tracking-widest uppercase text-stone-500 flex items-center gap-2">
                          Tasting History
                      </h4>
                  </div>
                  
                  <div className="flex flex-col">
                      {entries.map(log => (
                          <LogItem 
                              key={log.id} 
                              log={log} 
                              onUpdate={onUpdate} 
                              onDelete={onDelete} 
                          />
                      ))}
                  </div>
              </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* BUTTON COMPLETELY OUTSIDE DIALOG TRIGGER */}
      {!isPinned ? (
        <button 
          onClick={() => onPin(primaryEntry.cocktail_id)}
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
