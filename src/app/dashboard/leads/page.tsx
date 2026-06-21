import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Rocket } from 'lucide-react'
import LeadsClient from '@/components/LeadsClient'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get business for this user
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!business) {
    // If no business profile is set up, they can't have leads
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-6">
          <Rocket className="text-neutral-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">No leads captured yet</h2>
        <p className="text-neutral-400 mb-8 max-w-md">
          Deploy your AI receptionist and start collecting leads from your website visitors automatically.
        </p>
        <Link 
          href="/dashboard/deploy"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Rocket size={20} />
          Deploy Widget
        </Link>
      </div>
    )
  }

  // Fetch leads
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  if (!leads || leads.length === 0) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-6">
          <Rocket className="text-neutral-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">No leads captured yet</h2>
        <p className="text-neutral-400 mb-8 max-w-md">
          Deploy your AI receptionist and start collecting leads from your website visitors automatically.
        </p>
        <Link 
          href="/dashboard/deploy"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Rocket size={20} />
          Deploy Widget
        </Link>
      </div>
    )
  }

  // Calculate metrics
  const totalLeads = leads.length
  
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0,0,0,0)
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const newLeads = leads.filter(l => (l.status || 'new').toLowerCase() === 'new').length
  const leadsThisWeek = leads.filter(l => new Date(l.created_at) >= startOfWeek).length
  const leadsThisMonth = leads.filter(l => new Date(l.created_at) >= startOfMonth).length

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leads</h1>
        <p className="text-neutral-400">View and manage the leads captured by your AI receptionist.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h3 className="text-neutral-400 text-sm font-medium mb-2">Total Leads</h3>
          <p className="text-3xl font-bold">{totalLeads}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h3 className="text-blue-400 text-sm font-medium mb-2">New Leads</h3>
          <p className="text-3xl font-bold text-blue-400">{newLeads}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h3 className="text-neutral-400 text-sm font-medium mb-2">Leads This Week</h3>
          <p className="text-3xl font-bold">{leadsThisWeek}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h3 className="text-neutral-400 text-sm font-medium mb-2">Leads This Month</h3>
          <p className="text-3xl font-bold">{leadsThisMonth}</p>
        </div>
      </div>

      {/* Client Component for Interactive Table */}
      <LeadsClient initialLeads={leads} />
    </div>
  )
}
