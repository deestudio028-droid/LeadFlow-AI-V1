import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminAIPage() {
  const adminClient = createAdminClient()

  // Last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: requests } = await adminClient
    .from('api_requests_log')
    .select('*')
    .gte('created_at', thirtyDaysAgo.toISOString())

  const totalRequests = requests?.length || 0
  const failedRequests = requests?.filter(r => r.status_code >= 400).length || 0
  const totalTokens = requests?.reduce((sum, r) => sum + (r.total_tokens || 0), 0) || 0
  
  // Estimate cost: Llama-3-8b-instruct via NVIDIA is very cheap, let's say $0.50 per 1M tokens
  const estimatedCost = (totalTokens / 1000000) * 0.50

  const avgResponseTime = totalRequests > 0 
    ? Math.round((requests?.reduce((sum, r) => sum + r.response_time_ms, 0) || 0) / totalRequests)
    : 0

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">AI Usage Monitoring</h1>
        <p className="text-neutral-400">Track NVIDIA API usage, latency, and costs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Requests (30d)" value={totalRequests} />
        <MetricCard title="Failed Requests" value={failedRequests} isWarning={failedRequests > 0} />
        <MetricCard title="Avg Latency" value={`${avgResponseTime}ms`} />
        <MetricCard title="Est. Cost (30d)" value={`$${estimatedCost.toFixed(4)}`} />
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 text-white">Active Keys & Failover Strategy</h2>
        <div className="space-y-4">
          <div className="p-4 border border-green-500/20 bg-green-500/10 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-bold text-green-400">Primary Key</p>
              <p className="text-sm text-neutral-400 font-mono">NVIDIA_API_KEY (from .env)</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">ACTIVE</span>
          </div>
          
          <div className="p-4 border border-neutral-800 bg-neutral-900 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-bold text-neutral-300">Backup Key</p>
              <p className="text-sm text-neutral-500 font-mono">NVIDIA_API_KEY_BACKUP (from .env)</p>
            </div>
            <span className="px-3 py-1 bg-neutral-800 text-neutral-500 rounded-full text-xs font-bold">STANDBY</span>
          </div>
          
          <p className="text-sm text-neutral-500 mt-4">
            If the Primary key returns a 401 or 429 error, the system will automatically retry using the Backup key and log an Audit Event.
          </p>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, isWarning = false }: { title: string, value: string | number, isWarning?: boolean }) {
  return (
    <div className={`border rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden ${isWarning ? 'bg-red-500/10 border-red-500/20' : 'bg-neutral-950 border-neutral-800'}`}>
      <p className={`text-sm font-medium mb-2 ${isWarning ? 'text-red-400' : 'text-neutral-400'}`}>{title}</p>
      <p className={`text-3xl font-bold ${isWarning ? 'text-red-500' : 'text-white'}`}>{value}</p>
    </div>
  )
}
