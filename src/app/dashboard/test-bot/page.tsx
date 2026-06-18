import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TestBotClient from './TestBotClient'

export default async function TestBotPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Test Bot</h1>
        <p className="text-neutral-400">Test your AI assistant before deploying it to your website.</p>
      </div>

      {!business ? (
        <div className="p-4 bg-red-950/50 border border-red-900 rounded-lg text-red-400 text-sm">
          You must complete your Business Settings before testing the bot.
        </div>
      ) : (
        <TestBotClient businessId={business.id} />
      )}
    </div>
  )
}
