'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Package, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/leads',     icon: Users,           label: 'Leads'     },
  { href: '/packages',  icon: Package,         label: 'Packages'  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [botOnline, setBotOnline] = useState(null)

  useEffect(() => {
    const check = async () => {
      try {
        const r = await fetch('/api/health')
        const d = await r.json()
        setBotOnline(d.bot === 'connected')
      } catch { setBotOnline(false) }
    }
    check()
    const t = setInterval(check, 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <aside style={{
      width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%'
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <div>
            <p style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>IPTV CRM</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 1 }}>Morocco</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', padding: '8px 10px 4px' }}>Main</p>
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href} className={`nav-item${active ? ' active' : ''}`}>
              <Icon size={16} style={{ opacity: active ? 1 : 0.7 }} />
              {label}
              {href === '/leads' && (
                <span style={{
                  marginLeft: 'auto', fontSize: '0.65rem', background: 'var(--accent-2)',
                  color: 'var(--accent)', padding: '1px 6px', borderRadius: 99, fontWeight: 600
                }}>Live</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bot status */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {botOnline === null
            ? <div style={{ width:8,height:8,borderRadius:'50%',background:'var(--text-3)' }} />
            : botOnline
              ? <div className="pulse-dot" />
              : <div style={{ width:8,height:8,borderRadius:'50%',background:'var(--hot)' }} />
          }
          <span style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>
            Omar · {botOnline === null ? 'checking' : botOnline ? 'online' : 'offline'}
          </span>
        </div>
      </div>
    </aside>
  )
}
