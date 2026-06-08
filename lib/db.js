// Direct PostgREST API — no Supabase JS client, no WebSocket issues
const BASE = () => `${process.env.SUPABASE_URL}/rest/v1`

function H(extra = {}) {
  return {
    apikey: process.env.SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  }
}

async function get(table, qs = '') {
  const url = `${BASE()}/${table}${qs ? '?' + qs : ''}`
  const r = await fetch(url, { headers: H(), cache: 'no-store' })
  if (!r.ok) { console.error(`DB GET error [${table}]:`, await r.text()); return [] }
  return r.json()
}

async function countRows(table, filter = '') {
  const url = `${BASE()}/${table}${filter ? '?' + filter : ''}`
  const r = await fetch(url, { headers: H({ Prefer: 'count=exact', 'Range-Unit': 'items', Range: '0-0' }), cache: 'no-store' })
  const cr = r.headers.get('content-range') || '/0'
  return parseInt(cr.split('/')[1] ?? 0, 10)
}

async function patchRow(table, id, data) {
  const r = await fetch(`${BASE()}/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: H({ Prefer: 'return=representation' }),
    body: JSON.stringify(data),
    cache: 'no-store',
  })
  if (!r.ok) throw new Error(await r.text())
  const rows = await r.json()
  return rows[0]
}

// ── Dashboard queries ─────────────────────────────────────────

export async function getDashboardData() {
  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const month = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const month30 = new Date(now.getTime() - 30 * 86400000).toISOString()

  const [total, hot, todayCount, monthCount, subscribed,
         allScores, allCities, revenueRows, dailyRows, hotLeads] = await Promise.all([
    countRows('leads'),
    countRows('leads', 'score=eq.hot'),
    countRows('leads', `created_at=gte.${today}`),
    countRows('leads', `created_at=gte.${month}`),
    countRows('leads', 'status=eq.subscribed'),
    get('leads', 'select=score'),
    get('leads', 'select=city&city=not.is.null'),
    get('leads', 'select=revenue&status=eq.subscribed'),
    get('leads', `select=created_at&created_at=gte.${month30}&order=created_at.asc`),
    get('leads', 'select=*&score=eq.hot&status=eq.new&order=created_at.desc&limit=6'),
  ])

  const revenue = revenueRows.reduce((s, r) => s + (r.revenue || 0), 0)
  const photoCount = await countRows('leads', 'photo_sent=eq.true')

  const scoreCount = { hot: 0, warm: 0, cold: 0 }
  allScores.forEach(r => { if (scoreCount[r.score] !== undefined) scoreCount[r.score]++ })

  const cityMap = {}
  allCities.forEach(r => { if (r.city) cityMap[r.city] = (cityMap[r.city] || 0) + 1 })
  const cities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, count]) => ({ city, count }))

  const dayMap = {}
  dailyRows.forEach(r => { const d = r.created_at.substring(0, 10); dayMap[d] = (dayMap[d] || 0) + 1 })
  const daily = Object.entries(dayMap).map(([date, count]) => ({ date: date.slice(5), count }))

  return {
    stats: { total, hot, todayCount, monthCount, subscribed, revenue, photoRate: total > 0 ? Math.round(photoCount / total * 100) : 0, conversion: total > 0 ? Math.round(subscribed / total * 100) : 0 },
    scoreCount, cities, daily, hotLeads,
  }
}

// ── Leads list ───────────────────────────────────────────────

export async function getLeads({ score, status, search } = {}) {
  const parts = ['order=created_at.desc', 'limit=200']
  if (score)  parts.push(`score=eq.${score}`)
  if (status) parts.push(`status=eq.${status}`)
  if (search) parts.push(`or=(name.ilike.*${encodeURIComponent(search)}*,phone.ilike.*${encodeURIComponent(search)}*,city.ilike.*${encodeURIComponent(search)}*)`)
  return get('leads', parts.join('&'))
}

// ── Single lead ──────────────────────────────────────────────

export async function getLead(id) {
  const rows = await get('leads', `id=eq.${id}`)
  return rows[0] || null
}

export async function getMessages(leadId) {
  return get('messages', `lead_id=eq.${leadId}&order=created_at.asc`)
}

export async function getPackages() {
  return get('packages', 'is_active=eq.true&order=price_mad.asc')
}

// ── Mutations ────────────────────────────────────────────────

export async function updateLead(id, data) {
  return patchRow('leads', id, data)
}
