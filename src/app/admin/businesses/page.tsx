import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminBusinessesPage() {
  const adminClient = createAdminClient()

  // Get businesses
  const { data: businesses } = await adminClient
    .from('businesses')
    .select(`
      *,
      profiles ( role )
    `)
    .order('created_at', { ascending: false })

  // Need auth users to map emails
  const { data: usersData } = await adminClient.auth.admin.listUsers()
  
  // Aggregate stats
  const { data: leads } = await adminClient.from('leads').select('business_id')
  const { data: chats } = await adminClient.from('chat_logs').select('business_id')

  const mergedBusinesses = businesses?.map(b => {
    const ownerEmail = usersData?.users.find(u => u.id === b.owner_id)?.email || 'Unknown'
    const lCount = leads?.filter(l => l.business_id === b.id).length || 0
    const cCount = chats?.filter(c => c.business_id === b.id).length || 0

    return {
      ...b,
      ownerEmail,
      leadCount: lCount,
      chatCount: cCount
    }
  }) || []

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Business Management</h1>
        <p className="text-neutral-400">Monitor and manage client businesses.</p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="p-4 font-medium">Business Name</th>
                <th className="p-4 font-medium">Owner Email</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Created Date</th>
                <th className="p-4 font-medium">Leads</th>
                <th className="p-4 font-medium">Chats</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {mergedBusinesses.map(biz => (
                <tr key={biz.id} className="hover:bg-neutral-900/50 transition-colors text-neutral-300">
                  <td className="p-4 font-medium text-white">{biz.name}</td>
                  <td className="p-4">{biz.ownerEmail}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${biz.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {biz.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="p-4">{new Date(biz.created_at).toLocaleDateString()}</td>
                  <td className="p-4">{biz.leadCount}</td>
                  <td className="p-4">{biz.chatCount}</td>
                  <td className="p-4 flex items-center gap-4">
                    <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium transition-colors">
                      {biz.is_active ? 'Suspend' : 'Activate'}
                    </button>
                    <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                      Delete
                    </button>
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
