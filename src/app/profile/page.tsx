import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from './actions'
import { Star } from 'lucide-react'

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

  // Fetch Tasting Diary Entries
  const { data: diaryData } = await supabase
    .from('tasting_notes')
    .select('id, rating, notes, created_at, cocktail_id')
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
  if (topShelfData) {
      topShelfData.forEach((item, idx) => {
          if (idx < 4) {
              topShelfSlots[idx] = {
                  ...item,
                  cocktails: cocktailMap[item.cocktail_id] || { name: 'Unknown', thumbnail_url: null }
              };
          }
      });
  }

  // Hydrate Diary Data
  const hydratedDiaryData = diaryData ? diaryData.map(note => ({
      ...note,
      cocktails: cocktailMap[note.cocktail_id] || { name: 'Unknown Cocktail' }
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
                // @ts-ignore
                const { name, thumbnail_url } = slot.cocktails;
                return (
                    <div key={slot.cocktail_id} className="flex flex-col group cursor-pointer">
                        <div 
                            className="aspect-[2/3] w-full bg-stone-900 rounded-md overflow-hidden relative border border-stone-800 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                            title={name}
                        >
                            {thumbnail_url ? (
                                <img src={thumbnail_url} alt={name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900/50 p-2 text-center">
                                    <span className="text-[10px] font-serif text-stone-400 line-clamp-3 leading-tight">{name}</span>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-stone-400 mt-2 text-center truncate font-sans tracking-wide px-1">
                            {name}
                        </p>
                    </div>
                )
            }
            return (
                <div key={`empty-${i}`} className="flex flex-col">
                    <div className="aspect-[2/3] w-full bg-stone-900/40 border border-dashed border-stone-800 rounded-md flex items-center justify-center hover:bg-stone-900/80 transition-colors group cursor-default">
                        <span className="text-stone-700 group-hover:text-stone-500 transition-colors text-2xl font-light">+</span>
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
            <div className="flex flex-col gap-4">
                {hydratedDiaryData.map((note) => {
                    const dateObj = new Date(note.created_at);
                    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    // @ts-ignore
                    const cocktailName = note.cocktails?.name || 'Unknown Cocktail';

                    return (
                        <div key={note.id} className="p-4 bg-stone-900/40 border border-stone-800/60 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-serif text-stone-200 text-lg tracking-wide">{cocktailName}</h3>
                                <span className="text-[10px] uppercase tracking-widest text-stone-500">{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star 
                                        key={star}
                                        className={`w-3.5 h-3.5 ${note.rating >= star ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]' : 'text-stone-800'}`} 
                                        fill={note.rating >= star ? "currentColor" : "none"}
                                    />
                                ))}
                            </div>
                            <p className="text-sm font-serif text-stone-400 italic leading-relaxed">
                                "{note.notes}"
                            </p>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="py-16 text-center border border-dashed border-stone-800/60 rounded-lg bg-stone-900/20">
                <p className="text-sm font-sans text-stone-500 italic tracking-wide">No entries in your diary yet.</p>
            </div>
        )}
      </section>
    </div>
  )
}
