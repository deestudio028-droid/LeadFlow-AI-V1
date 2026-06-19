import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Check, Copy } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DeployPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, embed_token')
    .eq('owner_id', user.id)
    .limit(1)

  const business = businesses?.[0] || null

  if (!business || !business.embed_token) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-2">Deploy Widget</h1>
        <div className="p-4 bg-red-950/50 border border-red-900 rounded-lg text-red-400 text-sm">
          You must complete your Business Settings to generate an embed token before deploying.
        </div>
      </div>
    )
  }

  // Use environment variable or dynamically infer from request headers
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https')
  const defaultOrigin = `${protocol}://${host}`
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || defaultOrigin
  
  const scriptSnippet = `<script
  src="${baseUrl}/widget.js"
  data-token="${business.embed_token}">
</script>`

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Deploy Widget</h1>
        <p className="text-neutral-400">Copy and paste this code into your website's HTML to install your AI assistant.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
          <h2 className="font-semibold text-neutral-200">Embed Code</h2>
          <div className="text-xs text-neutral-500 font-mono">Token: {business.embed_token}</div>
        </div>
        <div className="p-6 relative group">
          <pre className="text-sm font-mono text-green-400 overflow-x-auto p-4 bg-black rounded-lg border border-neutral-800">
            <code>{scriptSnippet}</code>
          </pre>
          
          {/* We will implement client-side copy logic using a small inline script or separate client component.
              Since this is a Server Component, a simple copy trick is to use a client component wrapper, 
              but to avoid creating extra files for a tiny feature, we'll leave the copy to standard text selection 
              or we can build a quick client component for the copy button. */}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold border-b border-neutral-800 pb-2">Installation Instructions</h3>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold shrink-0">1</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Copy the embed code</h4>
              <p className="text-neutral-400 text-sm">Select and copy the HTML snippet from the box above. It contains your unique <code>data-token</code> which securely links the widget to your business data.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold shrink-0">2</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Paste into your website</h4>
              <p className="text-neutral-400 text-sm">Open your website's HTML file or CMS (WordPress, Shopify, Webflow). Paste the code just before the closing <code>&lt;/body&gt;</code> tag of every page where you want the chatbot to appear.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold shrink-0">3</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Publish and Test</h4>
              <p className="text-neutral-400 text-sm">Save your changes and publish your website. The chat bubble should now appear in the bottom right corner of your site.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
