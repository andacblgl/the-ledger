'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function pinToTopShelf(formData: FormData) {
  const cocktailId = formData.get('cocktail_id') as string;
  if (!cocktailId) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { count } = await supabase
    .from('top_shelf')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (count !== null && count >= 4) return;

  await supabase.from('top_shelf').insert({
    user_id: user.id,
    cocktail_id: cocktailId
  });

  revalidatePath('/profile');
}

export async function unpinFromTopShelf(formData: FormData) {
  const cocktailId = formData.get('cocktail_id') as string;
  if (!cocktailId) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('top_shelf').delete()
    .eq('user_id', user.id)
    .eq('cocktail_id', cocktailId);

  revalidatePath('/profile');
}
