import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const botUrl = process.env.BOT_API_URL
    if (!botUrl) return NextResponse.json({ bot: 'unknown' })
    const r = await fetch(`${botUrl}/health`, { cache: 'no-store', signal: AbortSignal.timeout(3000) })
    const d = await r.json()
    return NextResponse.json(d)
  } catch {
    return NextResponse.json({ bot: 'offline' })
  }
}
