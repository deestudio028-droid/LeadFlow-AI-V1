import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch business info to see if they've set it up
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome to LeadFlow AI</h1>
        <p className="text-neutral-400 mt-2">Manage your AI chatbot and business settings.</p>
      </div>

      {!business ? (
        <div className="bg-blue-900/20 border border-blue-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">Complete Your Setup</h2>
          <p className="text-neutral-300 mb-4">You need to set up your business profile before your chatbot can be activated.</p>
          <a href="/dashboard/business-settings" className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Go to Business Settings
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
            <h3 className="font-semibold text-lg text-white">Business Settings</h3>
            <p className="text-neutral-400 text-sm mt-1 mb-4">Manage your profile, hours, and custom instructions.</p>
            <a href="/dashboard/business-settings" className="text-blue-400 hover:underline text-sm font-medium">Manage Settings &rarr;</a>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
            <h3 className="font-semibold text-lg text-white">Knowledge Base</h3>
            <p className="text-neutral-400 text-sm mt-1 mb-4">Train your AI with FAQs, policies, and pricing info.</p>
            <a href="/dashboard/knowledge-base" className="text-blue-400 hover:underline text-sm font-medium">Manage Knowledge &rarr;</a>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
            <h3 className="font-semibold text-lg text-white">Test Bot</h3>
            <p className="text-neutral-400 text-sm mt-1 mb-4">Chat with your AI to see how it responds to customers.</p>
            <a href="/dashboard/test-bot" className="text-blue-400 hover:underline text-sm font-medium">Test Now &rarr;</a>
          </div>
        </div>
      )}
    </div>
  )
}
