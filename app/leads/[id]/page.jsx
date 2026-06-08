import { getLead, getMessages, getPackages } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ScoreBadge, StatusBadge } from '@/components/Badges'
import LeadEditForm from '@/components/LeadEditForm'
import ConversationView from '@/components/ConversationView'
import Link from 'next/link'
import { ArrowLeft, Phone, MapPin, Monitor, Tv, Camera } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function LeadDetailPage({ params }) {
  const { id } = await params
  const [lead, messages, packages] = await Promise.all([getLead(id), getMessages(id), getPackages()])
  if (!lead) notFound()

  const infoItems = [
    { icon: Phone,    label: 'Phone',    value: lead.phone },
    { icon: MapPin,   label: 'City',     value: lead.city || '—' },
    { icon: Monitor,  label: 'Device',   value: lead.device_type || '—' },
    { icon: Tv,       label: 'Channels', value: lead.channel_interest || '—' },
    { icon: Camera,   label: 'Photo',    value: lead.photo_sent ? '✓ Sent' : 'Not sent' },
  ]

  return (
    <div className="fade-up" style={{ padding: '2rem', maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.75rem' }}>
        <Link href="/leads" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-3)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.15s' }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          {lead.name || lead.phone}
        </h1>
        <ScoreBadge score={lead.score} />
        <StatusBadge status={lead.status} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginLeft: 'auto' }}>
          {new Date(lead.created_at).toLocaleDateString('en-GB', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1rem' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Info */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '1rem' }}>Lead Info</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} style={{ color: 'var(--text-3)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{label}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 500 }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
            {lead.wants_test && (
              <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--warm-bg)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--warm)' }}>
                🧪 Requested 1-hour test
                {lead.test_sent && ' · ✓ Sent'}
              </div>
            )}
            {lead.revenue > 0 && (
              <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--success-bg)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--success)' }}>
                💰 Revenue: {lead.revenue} MAD
              </div>
            )}
          </div>

          {/* Edit form */}
          <LeadEditForm lead={lead} packages={packages} />
        </div>

        {/* Right: conversation */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 500, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)' }}>Conversation</p>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{messages.length} messages</span>
          </div>
          <ConversationView messages={messages} />
        </div>
      </div>
    </div>
  )
}
