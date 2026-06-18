import Link from 'next/link'
import { signout } from '@/app/auth/actions'
import { LayoutDashboard, Settings, BookOpen, BotMessageSquare, MonitorPlay, Rocket, LogOut } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold">LeadFlow AI</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
            <LayoutDashboard size={20} />
            Overview
          </Link>
          <Link href="/dashboard/business-settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
            <Settings size={20} />
            Business Settings
          </Link>
          <Link href="/dashboard/knowledge-base" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
            <BookOpen size={20} />
            Knowledge Base
          </Link>
          <Link href="/dashboard/test-bot" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
            <BotMessageSquare size={20} />
            Test Bot
          </Link>
          <Link href="/dashboard/widget-preview" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
            <MonitorPlay size={20} />
            Widget Preview
          </Link>
          <Link href="/dashboard/deploy" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
            <Rocket size={20} />
            Deploy
          </Link>
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <form action={signout}>
            <button type="submit" className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-neutral-800 transition-colors">
              <LogOut size={20} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
