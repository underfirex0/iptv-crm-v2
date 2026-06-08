'use client'
import { useEffect, useRef, useState } from 'react'
import { Send, Bot, BotOff, Loader } from 'lucide-react'

export default function ConversationView({ messages, leadId, phone }) {
  const bottomRef  = useRef(null)
  const [text, setText]       = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [botPaused, setBotPaused] = useState(false)
  const [localMsgs, setLocalMsgs] = useState(messages || [])
  const [error, setError]     = useState('')

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [localMsgs])

  async function sendMessage() {
    if (!text.trim() || sending) return
    setSending(true)
    setError('')
    try {
      const r = await fetch(`/api/leads/${leadId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), phone }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Failed to send')

      // Add to local messages immediately
      setLocalMsgs(prev => [...prev, {
        id: Date.now(),
        role: 'bot',
        content: `[Manual] ${text.trim()}`,
        created_at: new Date().toISOString(),
        is_image: false,
      }])
      setText('')
      setSent(true)
      setBotPaused(true)
      setTimeout(() => setSent(false), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  async function toggleBot() {
    try {
      if (botPaused) {
        await fetch(`/api/leads/${leadId}/reply`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
        })
        setBotPaused(false)
      } else {
        setBotPaused(true)
      }
    } catch {}
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {localMsgs.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '0.85rem' }}>
            No messages yet
          </div>
        ) : localMsgs.map((msg, i) => {
          const isBot = msg.role === 'bot'
          const isManual = msg.content?.startsWith('[Manual]')
          return (
            <div key={msg.id || i} style={{ display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end' }}>
              <div style={{ maxWidth: '82%' }}>
                {isBot && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, paddingLeft: 2 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: isManual ? 'var(--success-bg)' : 'var(--accent-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: isManual ? 'var(--success)' : 'var(--accent)', fontWeight: 700 }}>
                      {isManual ? '👤' : 'ع'}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                      {isManual ? 'You (manual)' : 'Omar'}
                    </span>
                  </div>
                )}
                <div className={isBot ? 'bubble-bot' : 'bubble-user'}
                  style={{ padding: '10px 14px', fontSize: '0.875rem', lineHeight: 1.6, direction: 'rtl', textAlign: 'right',
                    ...(isManual ? { border: '1px solid rgba(46,202,139,0.2)', background: 'rgba(46,202,139,0.06)' } : {})
                  }}>
                  {msg.is_image && <span style={{ fontSize: '0.72rem', opacity: 0.7, display: 'block', marginBottom: 4 }}>📸 Image</span>}
                  {isManual ? msg.content.replace('[Manual] ', '') : msg.content}
                </div>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-3)', marginTop: 4, textAlign: isBot ? 'left' : 'right', paddingLeft: isBot ? 2 : 0 }}>
                  {new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply input */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '0.875rem 1rem' }}>
        {/* Bot status bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.75rem', color: botPaused ? 'var(--warm)' : 'var(--success)' }}>
            {botPaused ? <BotOff size={13} /> : <Bot size={13} />}
            {botPaused ? 'Bot paused — you are in control' : 'Bot active — Omar is replying'}
          </div>
          <button onClick={toggleBot}
            style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 99, border: `1px solid ${botPaused ? 'var(--success)' : 'var(--warm)'}`, background: 'none', cursor: 'pointer', color: botPaused ? 'var(--success)' : 'var(--warm)', transition: 'all 0.15s' }}>
            {botPaused ? '▶ Resume bot' : '⏸ Pause bot'}
          </button>
        </div>

        {/* Input row */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Type a message to send manually..."
            className="input"
            style={{ flex: 1, direction: 'auto' }}
          />
          <button onClick={sendMessage} disabled={sending || !text.trim()}
            style={{ width: 40, height: 40, borderRadius: 10, background: sent ? 'var(--success)' : 'var(--accent)', border: 'none', cursor: text.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: text.trim() ? 1 : 0.5, transition: 'all 0.15s' }}>
            {sending ? <Loader size={15} color="white" style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} color="white" />}
          </button>
        </div>

        {error && <p style={{ color: 'var(--hot)', fontSize: '0.75rem', marginTop: 6 }}>❌ {error}</p>}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
