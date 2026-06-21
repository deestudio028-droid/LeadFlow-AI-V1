import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BusinessSettingsForm from '@/components/BusinessSettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Business Settings</h1>
      <p className="text-neutral-400 mb-8">Update your business profile and configure your AI's core instructions.</p>

      <BusinessSettingsForm business={business || null} />
    </div>
  )
}
