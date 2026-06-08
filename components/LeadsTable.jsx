'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ScoreBadge, StatusBadge } from './Badges'
import { Search, Camera } from 'lucide-react'

export default function LeadsTable({ initialLeads }) {
  const [search, setSearch]   = useState('')
  const [score, setScore]     = useState('')
  const [status, setStatus]   = useState('')

  const leads = useMemo(() => {
    return (initialLeads || []).filter(l => {
      if (score  && l.score  !== score)  return false
      if (status && l.status !== status) return false
      if (search) {
        const q = search.toLowerCase()
        return (l.name||'').toLowerCase().includes(q) ||
               (l.phone||'').includes(q) ||
               (l.city||'').toLowerCase().includes(q)
      }
      return true
    })
  }, [initialLeads, search, score, status])

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, city..."
            className="input" style={{ paddingLeft: 32, width: 230 }} />
        </div>
        <select value={score} onChange={e => setScore(e.target.value)} className="input" style={{ width: 'auto' }}>
          <option value="">All scores</option>
          <option value="hot">🔴 Hot</option>
          <option value="warm">🟡 Warm</option>
          <option value="cold">🔵 Cold</option>
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="input" style={{ width: 'auto' }}>
          <option value="">All statuses</option>
          {['new','contacted','qualified','subscribed','lost'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
          ))}
        </select>
        {(search || score || status) && (
          <button onClick={() => { setSearch(''); setScore(''); setStatus('') }}
            className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: '0.8rem' }}>
            Clear
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-3)' }}>{leads.length} leads</span>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name / Phone</th>
                <th>City</th>
                <th>Device</th>
                <th>Channels</th>
                <th>Score</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Photo</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)' }}>No leads found</td></tr>
              ) : leads.map(lead => (
                <tr key={lead.id} className={`row-${lead.score}`}>
                  <td>
                    <Link href={`/leads/${lead.id}`} style={{ textDecoration: 'none' }}>
                      <p style={{ fontWeight: 500, color: 'var(--text)', fontSize: '0.875rem' }}>{lead.name || '—'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 1 }}>{lead.phone}</p>
                    </Link>
                  </td>
                  <td style={{ color: 'var(--text-2)' }}>{lead.city || '—'}</td>
                  <td style={{ color: 'var(--text-2)' }}>{lead.device_type || '—'}</td>
                  <td style={{ color: 'var(--text-2)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.channel_interest || '—'}</td>
                  <td><ScoreBadge score={lead.score} /></td>
                  <td><StatusBadge status={lead.status} /></td>
                  <td style={{ textAlign: 'center' }}>
                    {lead.photo_sent ? <Camera size={14} style={{ color: 'var(--warm)' }} /> : <span style={{ color: 'var(--text-3)' }}>—</span>}
                  </td>
                  <td style={{ color: 'var(--text-3)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                    {new Date(lead.created_at).toLocaleDateString('en-GB')}
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
