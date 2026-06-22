import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Ensure user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Ensure user is Admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'Admin') {
    // Unauthorized access attempt
    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="absolute inset-0 bg-red-900/5 pointer-events-none -z-10" />
        {children}
      </main>
    </div>
  )
}
