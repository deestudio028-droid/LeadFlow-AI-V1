import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminUsersPage() {
  const adminClient = createAdminClient()

  const { data: usersData, error: authError } = await adminClient.auth.admin.listUsers()
  
  if (authError || !usersData) {
    return <div>Error loading users: {authError?.message}</div>
  }

  const { data: profiles } = await adminClient.from('profiles').select('*')
  
  // Aggregate data
  const { data: businesses } = await adminClient.from('businesses').select('owner_id')
  const { data: leads } = await adminClient.from('leads').select('business_id, businesses(owner_id)')

  // Map users
  const mergedUsers = usersData.users.map(u => {
    const profile = profiles?.find(p => p.id === u.id)
    const bCount = businesses?.filter(b => b.owner_id === u.id).length || 0
    // leads count
    const lCount = leads?.filter(l => (l.businesses as any)?.owner_id === u.id).length || 0

    return {
      id: u.id,
      email: u.email,
      role: profile?.role || 'Client',
      created_at: u.created_at,
      businessCount: bCount,
      leadCount: lCount
    }
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">User Management</h1>
        <p className="text-neutral-400">View and manage all registered users.</p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Signup Date</th>
                <th className="p-4 font-medium">Businesses</th>
                <th className="p-4 font-medium">Leads Captured</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {mergedUsers.map(user => (
                <tr key={user.id} className="hover:bg-neutral-900/50 transition-colors text-neutral-300">
                  <td className="p-4 font-medium text-white">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'Admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-neutral-800 text-neutral-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="p-4">{user.businessCount}</td>
                  <td className="p-4">{user.leadCount}</td>
                  <td className="p-4">
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
