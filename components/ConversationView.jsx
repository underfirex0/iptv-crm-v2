'use client'
import { useEffect, useRef } from 'react'

export default function ConversationView({ messages }) {
  const bottomRef = useRef(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  if (!messages?.length) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '0.85rem', padding: '2rem' }}>
      No messages yet
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {messages.map((msg, i) => {
        const isBot = msg.role === 'bot'
        return (
          <div key={msg.id || i} style={{ display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end' }}>
            <div style={{ maxWidth: '82%' }}>
              {isBot && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, paddingLeft: 2 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700 }}>ع</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 500 }}>Omar</span>
                </div>
              )}
              <div
                className={isBot ? 'bubble-bot' : 'bubble-user'}
                style={{ padding: '10px 14px', fontSize: '0.875rem', lineHeight: 1.6, direction: 'rtl', textAlign: 'right' }}
              >
                {msg.is_image && <span style={{ fontSize: '0.72rem', opacity: 0.7, display: 'block', marginBottom: 4 }}>📸 Image</span>}
                {msg.content}
              </div>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-3)', marginTop: 4, paddingLeft: isBot ? 2 : 0, textAlign: isBot ? 'left' : 'right' }}>
                {new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
