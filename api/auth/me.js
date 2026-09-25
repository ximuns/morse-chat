import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

function hashValue(value) {
  return createHash('sha256').update(value).digest('hex')
}

function getSessionToken(req) {
  const cookieHeader = req.headers.cookie ?? ''

  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim())

  const sessionCookie = cookies.find((cookie) => cookie.startsWith('morse_session='))

  if (!sessionCookie) {
    return null
  }

  return sessionCookie.slice('morse_session='.length)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const sessionToken = getSessionToken(req)

    if (!sessionToken) {
      return res.status(200).json({
        authenticated: false,
      })
    }

    const tokenHash = hashValue(sessionToken)

    const { data: session, error } = await supabase
      .from('sessions')
      .select(
        `
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
            `,
      )
      .eq('token_hash', tokenHash)
      .maybeSingle()

    if (error) {
      return res.status(500).json({
        error: 'Database error',
      })
    }

    if (!session) {
      return res.status(200).json({
        authenticated: false,
      })
    }

    if (session.revoked_at) {
      return res.status(200).json({
        authenticated: false,
      })
    }

    if (new Date(session.expires_at).getTime() <= Date.now()) {
      return res.status(200).json({
        authenticated: false,
      })
    }

    const identity = session.identities

    if (!identity || identity.revoked_at) {
      return res.status(200).json({
        authenticated: false,
      })
    }

    await supabase
      .from('sessions')
      .update({
        last_seen_at: new Date().toISOString(),
      })
      .eq('id', session.id)

    return res.status(200).json({
      authenticated: true,
      identity: {
        id: identity.id,
        callsign: identity.callsign,
        publicKey: identity.public_key,
        keyAlgorithm: identity.key_algorithm,
        createdAt: identity.created_at,
      },
      session: {
        expiresAt: session.expires_at,
      },
    })
  } catch {
    return res.status(500).json({
      error: 'Internal server error',
    })
  }
}
