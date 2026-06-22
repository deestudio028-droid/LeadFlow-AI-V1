import { createClient } from '@/lib/supabase/server'

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  // We are running these queries in parallel using Promise.all
  const [
    { count: usersCount },
    { count: businessesCount },
    { count: leadsCount },
    { count: chatCount },
    { count: widgetCount }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('businesses').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('chat_logs').select('*', { count: 'exact', head: true }),
    supabase.from('widget_configs').select('*', { count: 'exact', head: true })
  ])

  // Get today's API requests
  const startOfDay = new Date()
  startOfDay.setUTCHours(0, 0, 0, 0)
  const { count: apiRequestsToday } = await supabase
    .from('api_requests_log')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfDay.toISOString())

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Platform Overview</h1>
        <p className="text-neutral-400">High-level metrics for LeadFlow AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="Total Users" value={usersCount || 0} />
        <MetricCard title="Total Businesses" value={businessesCount || 0} />
        <MetricCard title="Total Leads Captured" value={leadsCount || 0} />
        <MetricCard title="Total Conversations" value={chatCount || 0} />
        <MetricCard title="Active Widgets" value={widgetCount || 0} />
        <MetricCard title="API Requests Today" value={apiRequestsToday || 0} />
      </div>
    </div>
  )
}

function MetricCard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <div className="w-16 h-16 bg-red-500 rounded-full blur-2xl"></div>
      </div>
      <p className="text-sm font-medium text-neutral-400 mb-2">{title}</p>
      <p className="text-4xl font-bold text-white">{value}</p>
    </div>
  )
}
