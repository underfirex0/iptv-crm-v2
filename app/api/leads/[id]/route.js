import { updateLead } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(req, { params }) {
  try {
    const { id } = await params
    const body = await req.json()
    const allowed = ['status','score','notes','package_id','revenue','test_sent']
    const data = {}
    allowed.forEach(k => { if (body[k] !== undefined) data[k] = body[k] })
    const updated = await updateLead(id, data)
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
