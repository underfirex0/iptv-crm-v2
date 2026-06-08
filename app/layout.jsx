import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata = { title: 'IPTV CRM', description: 'Sales Intelligence Dashboard' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <Sidebar />
          <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
