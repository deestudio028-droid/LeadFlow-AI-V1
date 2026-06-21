'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = await createClient()

  // Ensure user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Update lead status
  // We rely on RLS to ensure the user can only update leads they own.
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/leads')
  return { success: true }
}
