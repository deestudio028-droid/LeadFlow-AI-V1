import { createClient } from '@/lib/supabase/server'
import { saveBusinessSettings } from './actions'
import { redirect } from 'next/navigation'

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

      <form action={saveBusinessSettings as any} className="space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300" htmlFor="name">Business Name *</label>
            <input 
              id="name" name="name" type="text" required defaultValue={business?.name || ''}
              className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300" htmlFor="phone">Phone Number</label>
            <input 
              id="phone" name="phone" type="tel" defaultValue={business?.phone || ''}
              className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300" htmlFor="email">Public Email</label>
            <input 
              id="email" name="email" type="email" defaultValue={business?.email || ''}
              className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300" htmlFor="business_hours">Business Hours</label>
            <input 
              id="business_hours" name="business_hours" type="text" placeholder="e.g. Mon-Fri: 9am-5pm" defaultValue={business?.business_hours || ''}
              className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300" htmlFor="address">Address</label>
          <input 
            id="address" name="address" type="text" defaultValue={business?.address || ''}
            className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300" htmlFor="description">Business Description</label>
          <textarea 
            id="description" name="description" rows={3} defaultValue={business?.description || ''}
            className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white resize-none"
          ></textarea>
        </div>

        <div className="space-y-2 pt-4 border-t border-neutral-800">
          <label className="text-sm font-medium text-neutral-300" htmlFor="system_prompt">Custom AI Instructions</label>
          <p className="text-xs text-neutral-500 mb-2">These instructions guide how your AI behaves. e.g., "Always be polite and direct users to book an appointment."</p>
          <textarea 
            id="system_prompt" name="system_prompt" rows={4} defaultValue={business?.system_prompt || ''}
            className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white resize-none"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
