import { getDashboardData } from '@/lib/db'
import DailyLeadsChart  from '@/components/charts/DailyLeadsChart'
import ScoreDonutChart  from '@/components/charts/ScoreDonutChart'
import CityBarChart     from '@/components/charts/CityBarChart'
import HotLeadsList     from '@/components/HotLeadsList'
import { Users, Flame, TrendingUp, DollarSign, Camera, BadgeCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { stats, scoreCount, cities, daily, hotLeads } = await getDashboardData()

  const kpis = [
    { icon: Users,      label: 'Total Leads',   value: stats.total,          sub: `+${stats.todayCount} today`,          color: '#6d57ff', bg: 'rgba(109,87,255,0.12)'  },
    { icon: Flame,      label: 'Hot Leads',     value: stats.hot,            sub: 'Need action now',                     color: '#ff3d5a', bg: 'rgba(255,61,90,0.12)'   },
    { icon: DollarSign, label: 'Revenue',        value: `${stats.revenue.toLocaleString()}`, sub: `${stats.subscribed} subscriptions`, color: '#2eca8b', bg: 'rgba(46,202,139,0.12)'  },
    { icon: TrendingUp, label: 'Conversion',    value: `${stats.conversion}%`, sub: `${stats.monthCount} leads this month`, color: '#ffab00', bg: 'rgba(255,171,0,0.12)'  },
    { icon: Camera,     label: 'Photo Rate',    value: `${stats.photoRate}%`, sub: 'Sent device photo',                  color: '#4dabf7', bg: 'rgba(77,171,247,0.12)'  },
    { icon: BadgeCheck, label: 'Subscribed',    value: stats.subscribed,     sub: 'Active clients',                     color: '#2eca8b', bg: 'rgba(46,202,139,0.12)'  },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="fade-up" style={{ padding: '2rem', maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', marginBottom: 4 }}>
          {new Date().toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          {greeting} 👋
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginTop: 4 }}>
          Here's what's happening with your leads today.
        </p>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {kpis.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.01em' }}>{label}</p>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1 }}>{value ?? 0}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 6 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '1.25rem' }}>Daily Leads — Last 30 Days</p>
          <DailyLeadsChart data={daily} />
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '1.25rem' }}>Score Distribution</p>
          <ScoreDonutChart data={scoreCount} />
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '1.25rem' }}>Top Cities</p>
          <CityBarChart data={cities} />
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)' }}>Hot Leads</p>
            {stats.hot > 0 && (
              <span style={{ fontSize: '0.7rem', background: 'var(--hot-bg)', color: 'var(--hot)', padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>
                {stats.hot} need action
              </span>
            )}
          </div>
          <HotLeadsList leads={hotLeads} />
        </div>
      </div>
    </div>
  )
}
