'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addFaq(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!business) return { error: 'Business not found. Please set up your business profile first.' }

  const data = {
    business_id: business.id,
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    type: 'faq'
  }

  const { error } = await supabase.from('knowledge_base').insert([data])

  if (error) return { error: error.message }

  revalidatePath('/dashboard/knowledge-base')
  return { success: true }
}

export async function deleteFaq(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('knowledge_base')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/knowledge-base')
  return { success: true }
}
