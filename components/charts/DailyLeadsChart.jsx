'use client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const Custom = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: '#9898b8', marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#eeeef5', fontWeight: 600 }}>{payload[0].value} leads</p>
    </div>
  )
}

export default function DailyLeadsChart({ data }) {
  if (!data?.length) return <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5c5c7a', fontSize: 13 }}>No data yet</div>
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6d57ff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6d57ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5c5c7a' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#5c5c7a' }} axisLine={false} tickLine={false} allowDecimals={false} width={20} />
        <Tooltip content={<Custom />} />
        <Area type="monotone" dataKey="count" stroke="#6d57ff" strokeWidth={2} fill="url(#grad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
