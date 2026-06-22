import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminAuditPage() {
  const adminClient = createAdminClient()

  // Get audit logs
  const { data: logs } = await adminClient
    .from('audit_logs')
    .select(`
      *,
      profiles ( role )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  // Get users for email mapping
  const { data: usersData } = await adminClient.auth.admin.listUsers()

  const mappedLogs = logs?.map(log => {
    const actorEmail = usersData?.users.find(u => u.id === log.actor_id)?.email || 'System'
    return {
      ...log,
      actorEmail
    }
  }) || []

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Audit Logs</h1>
        <p className="text-neutral-400">Immutable record of administrative and system events.</p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Actor</th>
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium">Target Type</th>
                <th className="p-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50 font-mono">
              {mappedLogs.map(log => (
                <tr key={log.id} className="hover:bg-neutral-900/50 transition-colors text-neutral-300">
                  <td className="p-4 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-4">{log.actorEmail}</td>
                  <td className="p-4 text-blue-400 font-bold">{log.action}</td>
                  <td className="p-4 text-neutral-400">{log.target_type}</td>
                  <td className="p-4 text-xs text-neutral-500 max-w-xs truncate" title={JSON.stringify(log.details)}>
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
