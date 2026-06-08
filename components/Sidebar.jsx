'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Package, Zap, Sun, Moon, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTheme } from './ThemeProvider'

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/leads',     icon: Users,           label: 'Leads'     },
  { href: '/packages',  icon: Package,         label: 'Packages'  },
]

export default function Sidebar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const { theme, toggle } = useTheme()
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

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside style={{
      width: 220,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%',
      transition: 'background 0.2s, border-color 0.2s'
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
                <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'var(--accent-2)', color: 'var(--accent)', padding: '1px 6px', borderRadius: 99, fontWeight: 600 }}>Live</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '10px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Theme toggle */}
        <button onClick={toggle}
          style={{
            display: 'flex', alignItems: 'center', gap: 9, width: '100%',
            padding: '7px 10px', borderRadius: 8, background: 'none',
            border: '1px solid var(--border)', cursor: 'pointer',
            color: 'var(--text-2)', fontSize: '0.82rem', transition: 'all 0.15s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-2)' }}>
          {theme === 'dark'
            ? <><Sun size={14} /> Light mode</>
            : <><Moon size={14} /> Dark mode</>
          }
        </button>

        {/* Logout */}
        <button onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: 9, width: '100%',
            padding: '7px 10px', borderRadius: 8, background: 'none',
            border: 'none', cursor: 'pointer',
            color: 'var(--text-3)', fontSize: '0.82rem', transition: 'all 0.15s'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--hot)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)' }}>
          <LogOut size={14} /> Sign out
        </button>

        {/* Bot status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px' }}>
          {botOnline === null
            ? <div style={{ width:6,height:6,borderRadius:'50%',background:'var(--text-3)' }} />
            : botOnline
              ? <div className="pulse-dot" style={{ width:6,height:6 }} />
              : <div style={{ width:6,height:6,borderRadius:'50%',background:'var(--hot)' }} />
          }
          <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
            Omar · {botOnline === null ? 'checking' : botOnline ? 'online' : 'offline'}
          </span>
        </div>
      </div>
    </aside>
  )
}
