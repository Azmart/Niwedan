const MAX_BODY_SIZE = 512
const SIGN_EXPIRY_SECONDS = 28800 // 8 hours: covers a long sitting plus a page refresh

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

function isSameSiteRequest(request) {
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) return false

  const origin = request.headers.get('origin')
  if (!origin && !fetchSite) return false
  if (!origin) return true
  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

function isJsonContentType(value) {
  return /^application\/json(?:\s*;.*)?$/i.test(value?.trim() || '')
}

// Mirrors apps/mission-143/src/gameEngine.js normalize(). Re-implemented here
// because server code must not import from the client app.
function normalize(value = '') {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase()
}

function parseList(value) {
  return String(value || '').split(',').map(item => item.trim()).filter(Boolean)
}

function isValidBody(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false
  const keys = Object.keys(payload)
  if (keys.length !== 2 || !keys.every(key => key === 'version' || key === 'name')) return false
  if (payload.version !== 1) return false
  return typeof payload.name === 'string' && payload.name.length >= 1 && payload.name.length <= 80
}

function isValidPath(path) {
  return typeof path === 'string' && path.length > 0 && path.length <= 200
    && !path.includes('..') && !path.startsWith('/')
}

function safeAlt(item) {
  return typeof item?.alt === 'string' ? item.alt : ''
}

// Classified here, from the configured path, because the signed URL the client
// receives carries a query string that makes extension sniffing unreliable.
// gif/png/jpg all render fine in <img>; only real video needs a <video> element.
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'ogv', 'ogg', 'mov', 'm4v'])
function mediaType(path) {
  const extension = String(path || '').split('?')[0].split('.').pop().toLowerCase()
  return VIDEO_EXTENSIONS.has(extension) ? 'video' : 'image'
}

// One group per media-backed question. Each must hold exactly 4 items, in the
// same order as that question's options.
const MEDIA_GROUPS = ['photo', 'meme', 'dress']

function emptyMedia() {
  return Object.fromEntries(MEDIA_GROUPS.map(group => [group, Array.from({ length: 4 }, () => ({ src: '', alt: '', type: 'image' }))]))
}

function parseMediaConfig(env) {
  try {
    const parsed = JSON.parse(env.MISSION_MEDIA || '')
    if (!parsed || typeof parsed !== 'object') return null
    // A group that is absent or the wrong shape falls back to 4 empty slots, so
    // adding a new group to MISSION_MEDIA never breaks the groups already set.
    return Object.fromEntries(MEDIA_GROUPS.map(group => {
      const items = parsed[group]
      return [group, Array.isArray(items) && items.length === 4 ? items : Array.from({ length: 4 }, () => ({}))]
    }))
  } catch {
    return null
  }
}

async function signPaths(env, fetchImpl, paths) {
  const signed = new Map()
  if (!paths.length) return signed
  try {
    const response = await fetchImpl(`${env.SUPABASE_URL}/storage/v1/object/sign/${env.SUPABASE_BUCKET}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiresIn: SIGN_EXPIRY_SECONDS, paths }),
    })
    if (!response.ok) return signed
    const results = await response.json()
    if (!Array.isArray(results)) return signed
    for (const result of results) {
      if (result && typeof result.path === 'string' && typeof result.signedURL === 'string' && !result.error) {
        signed.set(result.path, `${env.SUPABASE_URL}/storage/v1${result.signedURL}`)
      }
    }
  } catch {
    // Signing is best-effort and must never fail the whole request or leak details.
  }
  return signed
}

async function buildMedia(env, fetchImpl) {
  const config = parseMediaConfig(env)
  if (!config) return emptyMedia()

  const hasSupabase = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && env.SUPABASE_BUCKET
  const entries = MEDIA_GROUPS.flatMap(group => config[group]).map(item => ({ alt: safeAlt(item), valid: isValidPath(item?.path), path: item?.path }))

  const signed = hasSupabase
    ? await signPaths(env, fetchImpl, [...new Set(entries.filter(entry => entry.valid).map(entry => entry.path))])
    : new Map()

  const build = entry => ({ src: entry.valid ? (signed.get(entry.path) || '') : '', alt: entry.alt, type: mediaType(entry.path) })
  return Object.fromEntries(MEDIA_GROUPS.map((group, index) => [group, entries.slice(index * 4, index * 4 + 4).map(build)]))
}

export function createMissionUnlockHandler({ env = process.env, fetchImpl = fetch } = {}) {
  return async function missionUnlock(request) {
    if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' })
    if (!isSameSiteRequest(request)) return json(403, { error: 'Request origin is not allowed.' })
    if (!isJsonContentType(request.headers.get('content-type'))) return json(415, { error: 'Expected JSON.' })

    const declaredSize = Number(request.headers.get('content-length'))
    if (Number.isFinite(declaredSize) && declaredSize > MAX_BODY_SIZE) return json(413, { error: 'Request is too large.' })

    let payload
    try {
      const text = await request.text()
      if (new TextEncoder().encode(text).byteLength > MAX_BODY_SIZE) return json(413, { error: 'Request is too large.' })
      payload = JSON.parse(text)
    } catch {
      return json(400, { error: 'Invalid request.' })
    }
    if (!isValidBody(payload)) return json(400, { error: 'Invalid request.' })

    const acceptedRaw = parseList(env.MISSION_ALIASES)
    if (!acceptedRaw.length) return json(503, { error: 'Mission is unavailable.' })
    if (!env.MISSION_NAME_A || !env.MISSION_NAME_S) return json(503, { error: 'Mission is unavailable.' })

    const accepted = new Set(acceptedRaw.map(normalize))
    if (!accepted.has(normalize(payload.name))) return json(401, { error: 'Name not recognised.' })

    const media = await buildMedia(env, fetchImpl)

    return json(200, {
      names: { a: env.MISSION_NAME_A, s: env.MISSION_NAME_S },
      aliases: { a: parseList(env.MISSION_ALIASES_A), s: parseList(env.MISSION_ALIASES_S) },
      media,
    })
  }
}

export { MAX_BODY_SIZE }
