import Link from 'next/link'
import { ScoreBadge } from './Badges'
import { ArrowRight } from 'lucide-react'

export default function HotLeadsList({ leads }) {
  if (!leads?.length) return (
    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-3)', fontSize: '0.85rem' }}>
      No hot leads right now 🎯
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {leads.map(lead => (
        <Link key={lead.id} href={`/leads/${lead.id}`} style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            borderRadius: 10, background: 'var(--hot-bg)', border: '1px solid rgba(255,61,90,0.15)',
            transition: 'all 0.15s', cursor: 'pointer'
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,61,90,0.35)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,61,90,0.15)'}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {lead.name || lead.phone}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 1 }}>
                {[lead.city, lead.device_type].filter(Boolean).join(' · ') || lead.phone}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              {lead.photo_sent && <span style={{ fontSize: '0.65rem', color: 'var(--warm)' }}>📸 photo</span>}
            </div>
            <ArrowRight size={14} style={{ color: 'var(--hot)', flexShrink: 0 }} />
          </div>
        </Link>
      ))}
    </div>
  )
}
