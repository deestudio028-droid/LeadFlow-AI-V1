import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { addFaq, deleteFaq } from './actions'
import { Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function KnowledgeBasePage() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: businesses, error: businessError } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .limit(1)

  const business = businesses?.[0] || null

  console.log("--- Knowledge Base Page Render ---")
  console.log("User ID:", user.id)
  console.log("Business Lookup Data:", business)
  console.log("Business Lookup Error:", businessError)

  let faqs: any[] = []
  
  if (business) {
    const { data } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('business_id', business.id)
      .eq('type', 'faq')
      .order('created_at', { ascending: false })
    if (data) faqs = data
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
        <p className="text-neutral-400">Manage Frequently Asked Questions (FAQs) to train your AI.</p>
      </div>

      {!business && (
        <div className="p-4 bg-red-950/50 border border-red-900 rounded-lg text-red-400 text-sm">
          You must complete your Business Settings before adding FAQs.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add FAQ Form */}
        <div className="lg:col-span-1">
          <form action={addFaq as any} className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4 sticky top-8">
            <h2 className="text-lg font-semibold text-white">Add New FAQ</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300" htmlFor="title">Question (Title)</label>
              <input 
                id="title" name="title" type="text" required disabled={!business}
                className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white disabled:opacity-50"
                placeholder="e.g. Do you offer refunds?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300" htmlFor="content">Answer (Content)</label>
              <textarea 
                id="content" name="content" required disabled={!business} rows={4}
                className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white resize-none disabled:opacity-50"
                placeholder="e.g. Yes, within 30 days of purchase."
              ></textarea>
            </div>
            <button 
              type="submit" disabled={!business}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Add FAQ
            </button>
          </form>
        </div>

        {/* FAQ List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white">Existing FAQs</h2>
          {faqs.length === 0 ? (
            <div className="p-8 border border-neutral-800 border-dashed rounded-xl text-center text-neutral-500">
              No FAQs added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map(faq => (
                <div key={faq.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl flex gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">Q: {faq.title}</h3>
                    <p className="text-neutral-400 text-sm whitespace-pre-wrap">A: {faq.content}</p>
                  </div>
                  <div>
                    <form action={async () => {
                      'use server'
                      await deleteFaq(faq.id)
                    }}>
                      <button type="submit" className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
