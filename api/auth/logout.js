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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const sessionToken = getSessionToken(req)

    if (sessionToken) {
      const tokenHash = hashValue(sessionToken)

      await supabase
        .from('sessions')
        .update({
          revoked_at: new Date().toISOString(),
        })
        .eq('token_hash', tokenHash)
    }

    const isProduction =
      process.env.NODE_ENV === 'production'

    res.setHeader(
      'Set-Cookie',
      [
        'morse_session=',
        'HttpOnly',
        'Path=/',
        'SameSite=Lax',
        'Max-Age=0',
        isProduction ? 'Secure' : '',
      ]
        .filter(Boolean)
        .join('; ')
    )

    return res.status(200).json({
      success: true,
    })
  } catch {
    return res.status(500).json({
      error: 'Internal server error',
    })
  }
}