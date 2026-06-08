'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function CityBarChart({ data }) {
  if (!data?.length) return <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5c5c7a', fontSize: 13 }}>No data yet</div>
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} layout="vertical" barCategoryGap="30%">
        <XAxis type="number" tick={{ fontSize: 10, fill: '#5c5c7a' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="city" tick={{ fontSize: 11, fill: '#9898b8' }} axisLine={false} tickLine={false} width={80} />
        <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(109,87,255,0.08)' }} />
        <Bar dataKey="count" radius={[0,4,4,0]} name="Leads">
          {data.map((_, i) => <Cell key={i} fill={i === 0 ? '#6d57ff' : `rgba(109,87,255,${0.6 - i * 0.06})`} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
