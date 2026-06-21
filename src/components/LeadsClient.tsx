'use client'

import { useState } from 'react'
import { Download, Search, X } from 'lucide-react'
import { updateLeadStatus } from '@/app/dashboard/leads/actions'

type Lead = {
  id: string
  business_id: string
  visitor_name: string | null
  visitor_phone: string | null
  visitor_message: string | null
  status: string | null
  source: string | null
  created_at: string
}

export default function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.visitor_name?.toLowerCase().includes(search.toLowerCase())) ||
      (lead.visitor_phone?.toLowerCase().includes(search.toLowerCase()))
    
    const matchesStatus = statusFilter === 'All' || (lead.status || 'new').toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus })
    }
    // Server update
    await updateLeadStatus(leadId, newStatus)
  }

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return

    const headers = ['Name', 'Phone', 'Status', 'Date Captured', 'Context']
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(l => 
        [
          `"${l.visitor_name || 'Anonymous'}"`,
          `"${l.visitor_phone || 'N/A'}"`,
          `"${l.status || 'new'}"`,
          `"${new Date(l.created_at).toLocaleDateString()}"`,
          `"${(l.visitor_message || '').replace(/"/g, '""')}"`
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const statuses = ['New', 'Contacted', 'Qualified', 'Closed', 'Lost']

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-neutral-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-950/50">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input 
              type="text" 
              placeholder="Search name or phone..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white w-full md:w-64"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-white w-full md:w-auto"
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors w-full md:w-auto justify-center"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400 text-sm">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Lead Context</th>
              <th className="p-4 font-medium">Date Captured</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">
                  No leads found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedLeads.map(lead => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-neutral-800/50 cursor-pointer transition-colors group"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="p-4 text-white font-medium">
                    {lead.visitor_name || 'Anonymous'}
                  </td>
                  <td className="p-4 text-neutral-300">
                    {lead.visitor_phone || 'N/A'}
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={(lead.status || 'new').toLowerCase()}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`text-sm px-3 py-1 rounded-full outline-none appearance-none cursor-pointer border ${
                        (lead.status || 'new').toLowerCase() === 'new' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        (lead.status || '').toLowerCase() === 'contacted' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        (lead.status || '').toLowerCase() === 'qualified' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        (lead.status || '').toLowerCase() === 'closed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                      }`}
                    >
                      {statuses.map(s => <option key={s} value={s.toLowerCase()} className="bg-neutral-900 text-white">{s}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-neutral-400 max-w-xs truncate">
                    {lead.visitor_message || 'No context provided.'}
                  </td>
                  <td className="p-4 text-neutral-400 whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-neutral-800 flex justify-between items-center bg-neutral-950/30">
          <p className="text-sm text-neutral-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm rounded transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm rounded transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Lead Details Drawer/Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-md bg-neutral-950 h-full border-l border-neutral-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <h2 className="text-xl font-bold">Lead Details</h2>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{selectedLead.visitor_name || 'Anonymous Visitor'}</h3>
                  <p className="text-neutral-400">{selectedLead.visitor_phone || 'No phone provided'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-500 mb-1">Captured On</p>
                  <p className="text-neutral-300">{new Date(selectedLead.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-neutral-500 mb-2">Status</p>
                <select
                  value={(selectedLead.status || 'new').toLowerCase()}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                  className={`px-4 py-2 w-full rounded-lg outline-none cursor-pointer border ${
                    (selectedLead.status || 'new').toLowerCase() === 'new' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    (selectedLead.status || '').toLowerCase() === 'contacted' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    (selectedLead.status || '').toLowerCase() === 'qualified' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    (selectedLead.status || '').toLowerCase() === 'closed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                  }`}
                >
                  {statuses.map(s => <option key={s} value={s.toLowerCase()} className="bg-neutral-900 text-white">{s}</option>)}
                </select>
              </div>

              <div>
                <p className="text-sm text-neutral-500 mb-2">Conversation Context</p>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-neutral-300 whitespace-pre-wrap font-mono text-sm">
                  {selectedLead.visitor_message || 'No context was captured for this lead.'}
                </div>
              </div>

              {selectedLead.visitor_phone && (
                <a 
                  href={`tel:${selectedLead.visitor_phone}`}
                  className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors font-medium mt-8"
                >
                  Call {selectedLead.visitor_name ? selectedLead.visitor_name.split(' ')[0] : 'Lead'} Now
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
