'use client'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = { hot: '#ff3d5a', warm: '#ffab00', cold: '#4dabf7' }
const LABELS = { hot: 'Hot', warm: 'Warm', cold: 'Cold' }

export default function ScoreDonutChart({ data }) {
  const entries = Object.entries(data || {}).map(([name, value]) => ({ name, value })).filter(d => d.value > 0)
  if (!entries.length) return <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5c5c7a', fontSize: 13 }}>No data yet</div>
  const total = entries.reduce((s, e) => s + e.value, 0)
  return (
    <div style={{ position: 'relative' }}>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={entries} cx="50%" cy="50%" innerRadius={48} outerRadius={68} dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
            {entries.map(e => <Cell key={e.name} fill={COLORS[e.name]} strokeWidth={0} />)}
          </Pie>
          <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} formatter={(v, n) => [v, LABELS[n]]} />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
        <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'Bricolage Grotesque', letterSpacing: '-0.03em' }}>{total}</p>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>total</p>
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
        {entries.map(e => (
          <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS[e.name] }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{LABELS[e.name]} {e.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
