'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function saveBusinessSettings(formData: FormData) {
  console.log('--- START saveBusinessSettings ---')
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  console.log('User ID:', user?.id, 'Auth Error:', authError)

  if (!user) {
    console.error('Unauthorized: No user found')
    return { error: 'Unauthorized' }
  }

  const data = {
    owner_id: user.id,
    name: (formData.get('name') as string) || '',
    description: (formData.get('description') as string) || null,
    phone: (formData.get('phone') as string) || null,
    email: (formData.get('email') as string) || null,
    address: (formData.get('address') as string) || null,
    business_hours: (formData.get('business_hours') as string) || null,
    system_prompt: (formData.get('system_prompt') as string) || null,
  }
  
  console.log('Payload:', data)

  // ==========================================
  // SELF-HEALING SYSTEM: Ensure Profile Exists
  // ==========================================
  const adminClient = createAdminClient()
  
  // Try to find the profile
  const { data: profile } = await adminClient
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    console.log('Self-healing: Profile missing. Automatically creating profile for user:', user.id)
    const { error: profileError } = await adminClient
      .from('profiles')
      .insert({ id: user.id, role: 'Client' })

    if (profileError) {
      console.error('Self-healing Failed: Could not create profile.', profileError)
      return { error: 'Database consistency error: Failed to create user profile. Please contact support.' }
    }
    console.log('Self-healing: Profile created successfully.')
  }
  // ==========================================

  // Check if business exists
  const { data: existingBusinesses, error: fetchError } = await supabase
    .from('businesses')
    .select('id, embed_token')
    .eq('owner_id', user.id)
    .limit(1)

  const existingBusiness = existingBusinesses?.[0] || null

  console.log('Existing Business:', existingBusiness, 'Fetch Error:', fetchError)

  let result;
  
  if (existingBusiness) {
    console.log('Updating business:', existingBusiness.id)
    
    // Auto-generate token if not exists
    const updateData = { ...data }
    if (!existingBusiness.embed_token) {
      (updateData as any).embed_token = 'lf_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    result = await supabase
      .from('businesses')
      .update(updateData)
      .eq('id', existingBusiness.id)
      .eq('owner_id', user.id)
      .select()
  } else {
    console.log('Inserting new business...')
    const insertData = {
      ...data,
      embed_token: 'lf_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
    result = await supabase
      .from('businesses')
      .insert([insertData])
      .select()
  }

  console.log('Supabase Save Result:', JSON.stringify(result))

  if (result.error) {
    console.error('Save Error:', result.error)
    return { error: result.error.message }
  }

  if (!result.data || result.data.length === 0) {
    console.error('Save Error: No rows were returned (RLS blocked or silent failure).')
    return { error: 'Failed to save business settings' }
  }

  console.log('Save successful!')
  revalidatePath('/dashboard/business-settings')
  revalidatePath('/dashboard/knowledge-base')
  return { success: true }
}
