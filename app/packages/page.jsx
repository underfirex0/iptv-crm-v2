import { getPackages } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function PackagesPage() {
  const packages = await getPackages()

  return (
    <div className="fade-up" style={{ padding: '2rem', maxWidth: 1400 }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Packages</h1>
        <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', marginTop: 3 }}>Your IPTV subscription offerings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {packages.map((p, i) => (
          <div key={p.id} className="card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: i === 0 ? 'linear-gradient(90deg, var(--accent), #a78bfa)' : i === 1 ? 'var(--success)' : 'var(--warm)',
              borderRadius: '14px 14px 0 0'
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{p.name_ar}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: 2 }}>{p.name}</p>
              </div>
              <span style={{
                fontSize: '0.65rem', padding: '3px 8px', borderRadius: 99, fontWeight: 600,
                background: p.is_active ? 'var(--success-bg)' : 'var(--surface-3)',
                color: p.is_active ? 'var(--success)' : 'var(--text-3)'
              }}>{p.is_active ? 'Active' : 'Inactive'}</span>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'Bricolage Grotesque', letterSpacing: '-0.03em' }}>{p.price_mad}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginLeft: 4 }}>MAD / {p.duration}</span>
            </div>
            {p.description_ar && <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{p.description_ar}</p>}
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem 1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, fontSize: '0.85rem', color: 'var(--text-2)' }}>
        💡 To add or edit packages → Supabase dashboard → Table Editor → <code style={{ background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.8rem' }}>packages</code> table
      </div>
    </div>
  )
}
