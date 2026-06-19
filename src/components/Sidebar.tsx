'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Settings, BookOpen, BotMessageSquare, MonitorPlay, Rocket, LogOut, Menu, X } from 'lucide-react'
import { signout } from '@/app/auth/actions'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/business-settings', label: 'Business Settings', icon: Settings },
    { href: '/dashboard/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
    { href: '/dashboard/test-bot', label: 'Test Bot', icon: BotMessageSquare },
    { href: '/dashboard/widget-preview', label: 'Widget Preview', icon: MonitorPlay },
    { href: '/dashboard/deploy', label: 'Deploy', icon: Rocket },
  ]

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800 shrink-0">
        <h2 className="text-xl font-bold">LeadFlow AI</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-neutral-300 hover:text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:block">
          <h2 className="text-2xl font-bold text-white">LeadFlow AI</h2>
        </div>
        
        <nav className="flex-1 px-4 py-4 md:py-0 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white font-medium' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            )
          })}
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

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
