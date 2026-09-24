import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
)

function hashValue(value) {
  return createHash('sha256')
    .update(value)
    .digest('hex')
}

function getSessionToken(req) {
  const cookieHeader = req.headers.cookie ?? ''

  const cookies = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())

  const sessionCookie = cookies.find(
    (cookie) => cookie.startsWith('morse_session=')
  )

  if (!sessionCookie) {
    return null
  }

  return sessionCookie.slice('morse_session='.length)
}

export async function requireAuth(req) {
  const sessionToken = getSessionToken(req)

  if (!sessionToken) {
    return {
      authenticated: false,
      identity: null,
      session: null,
    }
  }

  const tokenHash = hashValue(sessionToken)

  const { data: session, error } = await supabase
    .from('sessions')
    .select(`
      id,
      identity_id,
      expires_at,
      revoked_at,
      identities (
        id,
        callsign,
        public_key,
        key_algorithm,
        created_at,
        revoked_at
      )
    `)
    .eq('token_hash', tokenHash)
    .maybeSingle()

  if (error) {
    throw new Error('Database error')
  }

  if (!session) {
    return {
      authenticated: false,
      identity: null,
      session: null,
    }
  }

  if (session.revoked_at) {
    return {
      authenticated: false,
      identity: null,
      session: null,
    }
  }

  if (
    new Date(session.expires_at).getTime() <=
    Date.now()
  ) {
    return {
      authenticated: false,
      identity: null,
      session: null,
    }
  }

  const identity = session.identities

  if (!identity || identity.revoked_at) {
    return {
      authenticated: false,
      identity: null,
      session: null,
    }
  }

  return {
    authenticated: true,
    identity,
    session,
  }
}

export { supabase }