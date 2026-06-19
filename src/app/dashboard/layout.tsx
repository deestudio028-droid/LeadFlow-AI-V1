import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-neutral-950 text-white overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full h-[calc(100vh-64px)] md:h-screen">
        {children}
      </main>
    </div>
  )
}
