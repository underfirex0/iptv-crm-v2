import { getLeads } from '@/lib/db'
import LeadsTable from '@/components/LeadsTable'

export const dynamic = 'force-dynamic'

export default async function LeadsPage({ searchParams }) {
  const sp = await searchParams
  const score  = sp?.score  || ''
  const status = sp?.status || ''
  const search = sp?.search || ''

  const leads = await getLeads({ score, status, search })

  return (
    <div className="fade-up" style={{ padding: '2rem', maxWidth: 1400 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Leads</h1>
        <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', marginTop: 3 }}>{leads.length} leads found</p>
      </div>
      <LeadsTable initialLeads={leads} />
    </div>
  )
}
