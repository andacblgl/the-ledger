'use client';

import { signout } from './actions';
import { useCuratorVault } from '@/hooks/useCuratorVault';
import { TopShelfCard } from '@/components/Curator/TopShelfCard';
import { DiaryCard } from '@/components/Curator/DiaryCard';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const {
    user,
    isLoading,
    stats,
    topShelfSlots,
    activeTopShelfCount,
    diaryEntries,
    pinToShelf,
    unpinFromShelf
  } = useCuratorVault();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-stone-600" />
      </div>
    );
  }

  if (!user) {
    return null; // The hook or middleware handles redirect, but we prevent render
  }

  const initial = user.email ? user.email.charAt(0).toUpperCase() : 'C';

  return (
    <div className="p-6 pt-10 flex flex-col h-full bg-background text-foreground w-full max-w-3xl mx-auto">
      {/* 5. Utility Sign Out (Top Right) */}
      <div className="flex justify-end mb-4">
        <form action={signout}>
          <button className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-300 transition-colors">
            Sign Out
          </button>
        </form>
      </div>

      {/* 2. The Curator Header */}
      <header className="flex flex-col items-center text-center mb-10 mt-4 shrink-0">
        <div className="w-20 h-20 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mb-4 shadow-sm">
          <span className="text-3xl font-serif text-stone-300">{initial}</span>
        </div>
        <h1 className="text-lg font-serif text-stone-200 mb-1">{user.email}</h1>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-primary font-serif text-xl leading-none mb-1">{stats.vaultedCount}</span>
            <span className="text-[10px] uppercase tracking-widest text-stone-500">Vaulted</span>
          </div>
          <div className="w-px h-8 bg-stone-800"></div>
          <div className="flex flex-col items-center">
            <span className="text-primary font-serif text-xl leading-none mb-1">{stats.notesCount}</span>
            <span className="text-[10px] uppercase tracking-widest text-stone-500">Tasting Notes</span>
          </div>
        </div>
      </header>

      {/* 3. The Top Shelf */}
      <section className="mb-12 shrink-0">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-500 mb-4 border-b border-stone-800/60 pb-2">
          Top Shelf
        </h2>
        <div className="grid grid-cols-4 gap-3 items-start">
          {topShelfSlots.map((slot, i) => (
            <TopShelfCard 
              key={slot ? slot.cocktail_id : `empty-${i}`} 
              slot={slot} 
              onUnpin={unpinFromShelf} 
            />
          ))}
        </div>
      </section>

      {/* 4. Tasting Diary */}
      <section className="flex-1 pb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-500 mb-4 border-b border-stone-800/60 pb-2">
          Tasting Diary
        </h2>
        
        {diaryEntries.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {diaryEntries.map((entry) => {
              const isPinned = topShelfSlots.some(s => s && s.cocktail_id === entry.cocktail_id);
              const canPin = activeTopShelfCount < 4;

              return (
                <DiaryCard 
                  key={entry.id}
                  entry={entry}
                  isPinned={isPinned}
                  canPin={canPin}
                  onPin={pinToShelf}
                />
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-stone-800/60 rounded-lg bg-stone-900/20">
            <p className="text-sm font-sans text-stone-500 italic tracking-wide">No bookmarks in your diary yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
