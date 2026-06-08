'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader } from 'lucide-react'

const STATUSES = ['new','contacted','qualified','subscribed','lost']
const SCORES   = ['hot','warm','cold']

export default function LeadEditForm({ lead, packages }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [form, setForm] = useState({
    status:     lead.status     || 'new',
    score:      lead.score      || 'cold',
    notes:      lead.notes      || '',
    package_id: lead.package_id || '',
    revenue:    lead.revenue    || '',
    test_sent:  lead.test_sent  || false,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function save() {
    setSaving(true)
    try {
      await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSaved(true)
      setTimeout(() => { setSaved(false); router.refresh() }, 1500)
    } finally { setSaving(false) }
  }

  const Label = ({ children }) => (
    <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>{children}</p>
  )

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '1rem' }}>Update Lead</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <Label>Status</Label>
            <select value={form.status} onChange={e => set('status', e.target.value)} className="input">
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <Label>Score</Label>
            <select value={form.score} onChange={e => set('score', e.target.value)} className="input">
              {SCORES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {packages?.length > 0 && (
          <div>
            <Label>Package</Label>
            <select value={form.package_id} onChange={e => set('package_id', e.target.value)} className="input">
              <option value="">Select package...</option>
              {packages.map(p => <option key={p.id} value={p.id}>{p.name_ar} — {p.price_mad} MAD</option>)}
            </select>
          </div>
        )}

        <div>
          <Label>Revenue (MAD)</Label>
          <input type="number" value={form.revenue} onChange={e => set('revenue', e.target.value)}
            className="input" placeholder="0" />
        </div>

        <div>
          <Label>Notes</Label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
            rows={3} className="input" style={{ resize: 'vertical' }} placeholder="Add a note..." />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
          <div style={{
            width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${form.test_sent ? 'var(--success)' : 'var(--border-2)'}`,
            background: form.test_sent ? 'var(--success)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0
          }} onClick={() => set('test_sent', !form.test_sent)}>
            {form.test_sent && <Check size={11} color="white" strokeWidth={3} />}
          </div>
          <input type="checkbox" checked={form.test_sent} onChange={() => {}} style={{ display: 'none' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>Test sent ✓</span>
        </label>

        <button onClick={save} disabled={saving || saved} className="btn btn-primary" style={{ justifyContent: 'center' }}>
          {saving ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
           : saved  ? <><Check size={14} /> Saved!</>
           : 'Save Changes'}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
