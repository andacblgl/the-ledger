'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { HydratedTopShelfSlot, HydratedDiaryEntry, BaseCocktail } from '@/types';
import { toast } from 'sonner';

export function useCuratorVault() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [topShelfSlots, setTopShelfSlots] = useState<(HydratedTopShelfSlot | null)[]>(Array(4).fill(null));
  const [diaryEntries, setDiaryEntries] = useState<HydratedDiaryEntry[]>([]);
  const [stats, setStats] = useState({ vaultedCount: 0, notesCount: 0 });

  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    
    async function loadVault() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        if (isMounted) setIsLoading(false);
        return;
      }
      
      const currentUser = session.user;
      if (isMounted) setUser(currentUser);

      const [{ count: vaultedCount }, { count: notesCount }] = await Promise.all([
        supabase.from('user_ingredients').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id),
        supabase.from('tasting_notes').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id)
      ]);

      if (isMounted) setStats({ vaultedCount: vaultedCount || 0, notesCount: notesCount || 0 });

      const { data: topShelfData } = await supabase
        .from('top_shelf')
        .select('cocktail_id, added_at')
        .eq('user_id', currentUser.id)
        .order('added_at', { ascending: true })
        .limit(4);

      const { data: diaryData } = await supabase
        .from('bookmarks')
        .select('id, created_at, cocktail_id, rating, note, user_id')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      const cocktailIds = new Set<string>();
      if (topShelfData) topShelfData.forEach(item => cocktailIds.add(item.cocktail_id));
      if (diaryData) diaryData.forEach(item => cocktailIds.add(item.cocktail_id));

      const cocktailMap: Record<string, BaseCocktail> = {};
      if (cocktailIds.size > 0) {
        const { data: cocktailsData } = await supabase
            .from('cocktails')
            .select('id, name, thumbnail_url, flavor_tags')
            .in('id', Array.from(cocktailIds));
        
        if (cocktailsData) {
            cocktailsData.forEach(c => {
                cocktailMap[c.id] = c as BaseCocktail;
            });
        }
      }

      if (!isMounted) return;

      const newSlots: (HydratedTopShelfSlot | null)[] = Array(4).fill(null);
      if (topShelfData) {
        // Reconstruct order exactly as fetched (ascending by added_at)
        let slotIndex = 0;
        topShelfData.forEach((item) => {
          if (slotIndex < 4) {
            newSlots[slotIndex] = {
              cocktail_id: item.cocktail_id,
              added_at: item.added_at,
              cocktail: cocktailMap[item.cocktail_id] || { id: item.cocktail_id, name: 'Unknown', thumbnail_url: null, flavor_tags: null }
            };
            slotIndex++;
          }
        });
      }
      setTopShelfSlots(newSlots);

      const newDiary: HydratedDiaryEntry[] = diaryData ? diaryData.map(note => ({
        ...note,
        cocktail: cocktailMap[note.cocktail_id] || { id: note.cocktail_id, name: 'Unknown Cocktail', thumbnail_url: null, flavor_tags: null }
      })) : [];
      setDiaryEntries(newDiary);
      setIsLoading(false);
    }

    loadVault();

    return () => { isMounted = false; };
  }, []);

  const activeTopShelfCount = topShelfSlots.filter(s => s !== null).length;

  const pinToShelf = async (cocktailId: string) => {
    if (!user) return;
    if (activeTopShelfCount >= 4) {
      toast.error('Top Shelf is full');
      return;
    }

    const diaryEntry = diaryEntries.find(d => d.cocktail_id === cocktailId);
    if (!diaryEntry) return;

    // Optimistic Update
    setTopShelfSlots(prev => {
      const next = [...prev];
      const emptyIdx = next.findIndex(s => s === null);
      if (emptyIdx !== -1) {
        next[emptyIdx] = {
          cocktail_id: cocktailId,
          added_at: new Date().toISOString(),
          cocktail: diaryEntry.cocktail
        };
      }
      return next;
    });

    const { error } = await supabase.from('top_shelf').insert({
      user_id: user.id,
      cocktail_id: cocktailId
    });

    if (error) {
      toast.error('Failed to pin to Top Shelf');
      setTopShelfSlots(prev => {
        const next = [...prev];
        const idx = next.findIndex(s => s?.cocktail_id === cocktailId);
        if (idx !== -1) next[idx] = null;
        return next;
      });
    } else {
      toast.success('Pinned to Top Shelf');
    }
  };

  const unpinFromShelf = async (cocktailId: string) => {
    if (!user) return;

    const slotToRevert = topShelfSlots.find(s => s?.cocktail_id === cocktailId);

    // Optimistic Update
    setTopShelfSlots(prev => {
      const next = prev.map(slot => slot?.cocktail_id === cocktailId ? null : slot);
      // Compact the array to remove gaps so new pins append nicely
      const active: (HydratedTopShelfSlot | null)[] = next.filter(s => s !== null);
      while(active.length < 4) active.push(null);
      return active;
    });

    const { error } = await supabase.from('top_shelf').delete()
      .eq('user_id', user.id)
      .eq('cocktail_id', cocktailId);

    if (error) {
      toast.error('Failed to unpin from Top Shelf');
      setTopShelfSlots(prev => {
        const next = [...prev];
        const emptyIdx = next.findIndex(s => s === null);
        if (emptyIdx !== -1 && slotToRevert) {
          next[emptyIdx] = slotToRevert;
        }
        return next;
      });
    } else {
      toast.success('Unpinned from Top Shelf');
    }
  };

  return {
    user,
    isLoading,
    stats,
    topShelfSlots,
    activeTopShelfCount,
    diaryEntries,
    pinToShelf,
    unpinFromShelf
  };
}
