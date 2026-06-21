'use client'

import { useState } from 'react'
import { saveBusinessSettings } from '@/app/dashboard/business-settings/actions'
import { CheckCircle2, AlertCircle } from 'lucide-react'

type BusinessData = {
  name: string | null
  phone: string | null
  email: string | null
  address: string | null
  business_hours: string | null
  description: string | null
  system_prompt: string | null
}

export default function BusinessSettingsForm({ business }: { business: BusinessData | null }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await saveBusinessSettings(formData)
      
      if (result.error) {
        setStatus({ type: 'error', message: result.error })
      } else {
        setStatus({ type: 'success', message: 'Business settings saved.' })
      }
    } catch (error) {
      console.error(error)
      setStatus({ type: 'error', message: 'Unable to save business settings.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-xl relative">
      
      {/* Toast Notification */}
      {status && (
        <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300" htmlFor="name">Business Name *</label>
          <input 
            id="name" name="name" type="text" required defaultValue={business?.name || ''}
            className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300" htmlFor="phone">Phone Number</label>
          <input 
            id="phone" name="phone" type="tel" defaultValue={business?.phone || ''}
            className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300" htmlFor="email">Public Email</label>
          <input 
            id="email" name="email" type="email" defaultValue={business?.email || ''}
            className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300" htmlFor="business_hours">Business Hours</label>
          <input 
            id="business_hours" name="business_hours" type="text" placeholder="e.g. Mon-Fri: 9am-5pm" defaultValue={business?.business_hours || ''}
            className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300" htmlFor="address">Address</label>
        <input 
          id="address" name="address" type="text" defaultValue={business?.address || ''}
          className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300" htmlFor="description">Business Description</label>
        <textarea 
          id="description" name="description" rows={3} defaultValue={business?.description || ''}
          className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white resize-none"
        ></textarea>
      </div>

      <div className="space-y-2 pt-4 border-t border-neutral-800">
        <label className="text-sm font-medium text-neutral-300" htmlFor="system_prompt">Custom AI Instructions</label>
        <p className="text-xs text-neutral-500 mb-2">These instructions guide how your AI behaves. e.g., "Always be polite and direct users to book an appointment."</p>
        <textarea 
          id="system_prompt" name="system_prompt" rows={4} defaultValue={business?.system_prompt || ''}
          className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white resize-none"
        ></textarea>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
