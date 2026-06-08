import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout, pinToTopShelf, unpinFromTopShelf } from './actions'
import { Star, Minus, BookmarkPlus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get initial for avatar
  const initial = user.email ? user.email.charAt(0).toUpperCase() : 'C'

  // Fetch Stats
  const { count: vaultedCount } = await supabase
    .from('user_ingredients')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: notesCount } = await supabase
    .from('tasting_notes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Fetch Top Shelf
  const { data: topShelfData } = await supabase
    .from('top_shelf')
    .select('cocktail_id, added_at')
    .eq('user_id', user.id)
    .order('added_at', { ascending: true })
    .limit(4);

  // Fetch Tasting Diary Entries from Bookmarks
  const { data: diaryData } = await supabase
    .from('bookmarks')
    .select('id, created_at, cocktail_id, rating, note')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Manually fetch and map cocktail data since there is no explicit Foreign Key
  const cocktailIds = new Set<string>();
  if (topShelfData) topShelfData.forEach(item => cocktailIds.add(item.cocktail_id));
  if (diaryData) diaryData.forEach(item => cocktailIds.add(item.cocktail_id));

  const cocktailMap: Record<string, any> = {};
  if (cocktailIds.size > 0) {
      const { data: cocktailsData } = await supabase
          .from('cocktails')
          .select('id, name, thumbnail_url')
          .in('id', Array.from(cocktailIds));
      
      if (cocktailsData) {
          cocktailsData.forEach(c => {
              cocktailMap[c.id] = c;
          });
      }
  }

  // Hydrate Top Shelf Slots
  const topShelfSlots = Array(4).fill(null);
  let activeTopShelfCount = 0;
  if (topShelfData) {
      topShelfData.forEach((item, idx) => {
          if (idx < 4) {
              topShelfSlots[idx] = {
                  ...item,
                  cocktails: cocktailMap[item.cocktail_id] || { name: 'Unknown', thumbnail_url: null }
              };
              activeTopShelfCount++;
          }
      });
  }

  // Hydrate Diary Data
  const hydratedDiaryData = diaryData ? diaryData.map(note => ({
      ...note,
      cocktails: cocktailMap[note.cocktail_id] || { name: 'Unknown Cocktail', thumbnail_url: null }
  })) : [];

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
            <span className="text-primary font-serif text-xl leading-none mb-1">{vaultedCount || 0}</span>
            <span className="text-[10px] uppercase tracking-widest text-stone-500">Vaulted</span>
          </div>
          <div className="w-px h-8 bg-stone-800"></div>
          <div className="flex flex-col items-center">
            <span className="text-primary font-serif text-xl leading-none mb-1">{notesCount || 0}</span>
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
          {topShelfSlots.map((slot, i) => {
            if (slot && slot.cocktails) {
                const { name, thumbnail_url } = slot.cocktails;
                return (
                    <div key={slot.cocktail_id} className="flex flex-col group relative">
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
                            
                            <form action={unpinFromTopShelf} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <input type="hidden" name="cocktail_id" value={slot.cocktail_id} />
                                <button type="submit" className="bg-black/60 hover:bg-red-500/80 text-white p-1 rounded-full backdrop-blur-sm transition-colors border border-white/10">
                                    <Minus className="w-3 h-3" />
                                </button>
                            </form>
                        </div>
                        <p className="text-xs text-stone-400 mt-2 text-center truncate font-sans tracking-wide px-1">
                            {name}
                        </p>
                    </div>
                )
            }
            return (
                <div key={`empty-${i}`} className="flex flex-col">
                    <div className="aspect-[2/3] w-full bg-stone-900/40 border border-dashed border-stone-800 rounded-md flex flex-col items-center justify-center group cursor-default p-2 text-center">
                        <span className="text-stone-800 text-2xl font-light mb-1">+</span>
                        <span className="text-[8px] uppercase tracking-widest text-stone-600 leading-tight">Pin your<br/>signature</span>
                    </div>
                    {/* Invisible text to maintain identical grid height symmetry */}
                    <p className="text-xs mt-2 opacity-0 truncate px-1">
                        Placeholder
                    </p>
                </div>
            )
          })}
        </div>
      </section>

      {/* 4. Tasting Diary */}
      <section className="flex-1 pb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-500 mb-4 border-b border-stone-800/60 pb-2">
          Tasting Diary
        </h2>
        
        {hydratedDiaryData && hydratedDiaryData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hydratedDiaryData.map((note) => {
                    const dateObj = new Date(note.created_at);
                    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const cocktailName = note.cocktails?.name || 'Unknown Cocktail';
                    const thumbnailUrl = note.cocktails?.thumbnail_url;
                    
                    const isPinned = topShelfSlots.some(s => s && s.cocktail_id === note.cocktail_id);
                    const canPin = activeTopShelfCount < 4;

                    return (
                        <div key={note.id} className="p-3 bg-stone-900/40 border border-stone-800/60 rounded-lg flex flex-col relative group">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div role="button" tabIndex={0} className="flex flex-col cursor-pointer flex-1 outline-none">
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
                                        
                                        {note.rating > 0 && (
                                            <div className="flex items-center gap-0.5 mb-1 opacity-50">
                                                {[...Array(note.rating)].map((_, i) => (
                                                    <Star key={i} className="w-2.5 h-2.5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" fill="currentColor" />
                                                ))}
                                            </div>
                                        )}
                                        
                                        <span className="text-[10px] uppercase tracking-widest text-stone-500 mb-3">{formattedDate}</span>
                                    </div>
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
                                                {note.rating > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(note.rating)].map((_, i) => (
                                                            <Star key={i} className="w-4 h-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" fill="currentColor" />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </DialogHeader>

                                        {note.note && (
                                            <div className="border-l border-amber-500/30 pl-4 py-1 mt-6">
                                                <p className="font-serif text-stone-300 text-sm leading-relaxed italic">
                                                    "{note.note}"
                                                </p>
                                            </div>
                                        )}
                                        
                                        {!note.note && note.rating === 0 && (
                                            <p className="text-sm font-sans text-stone-500 italic">Saved to diary without a note.</p>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {!isPinned && (
                                <form action={pinToTopShelf} className="mt-auto">
                                    <input type="hidden" name="cocktail_id" value={note.cocktail_id} />
                                    <button 
                                        type="submit" 
                                        disabled={!canPin}
                                        className={`w-full py-1.5 px-2 flex items-center justify-center gap-1.5 text-[10px] tracking-widest uppercase rounded border transition-colors ${canPin ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20 hover:border-amber-500/50' : 'bg-stone-900 border-stone-800 text-stone-600 opacity-50 cursor-not-allowed'}`}
                                    >
                                        <BookmarkPlus className="w-3 h-3" />
                                        Pin to Shelf
                                    </button>
                                </form>
                            )}
                            {isPinned && (
                                <div className="mt-auto w-full py-1.5 px-2 flex items-center justify-center gap-1.5 text-[10px] tracking-widest uppercase rounded border border-amber-500/10 text-amber-500/50 bg-transparent cursor-default">
                                    <Star className="w-3 h-3" />
                                    Pinned
                                </div>
                            )}
                        </div>
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
  )
}
