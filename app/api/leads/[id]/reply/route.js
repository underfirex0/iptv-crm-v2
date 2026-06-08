import { NextResponse } from 'next/server'
import { updateLead } from '@/lib/db'

export async function POST(req, { params }) {
  try {
    const { id } = await params
    const { message, phone } = await req.json()

    if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

    const botUrl = process.env.BOT_API_URL
    if (!botUrl) return NextResponse.json({ error: 'BOT_API_URL not configured' }, { status: 500 })

    // Send via bot VM
    const r = await fetch(`${botUrl}/api/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET || '',
      },
      body: JSON.stringify({ phone, message, lead_id: id }),
    })

    if (!r.ok) {
      const err = await r.json()
      return NextResponse.json({ error: err.error || 'Bot error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Resume bot for this lead
export async function DELETE(req, { params }) {
  try {
    const { id } = await params
    const { phone } = await req.json()

    const botUrl = process.env.BOT_API_URL
    if (botUrl) {
      await fetch(`${botUrl}/api/resume-bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET || '' },
        body: JSON.stringify({ phone }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
