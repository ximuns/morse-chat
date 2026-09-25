import { createHmac } from 'node:crypto'

import { requireAuth } from '../_lib/auth.js'

function base64Url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function createJwt(identityId) {
  const secret = process.env.SUPABASE_JWT_SECRET

  if (!secret) {
    throw new Error('SUPABASE_JWT_SECRET is not defined')
  }

  const now = Math.floor(Date.now() / 1000)

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const payload = {
    sub: identityId,
    role: 'authenticated',
    aud: 'authenticated',
    iat: now,
    exp: now + 300,
  }

  const encodedHeader = base64Url(JSON.stringify(header))

  const encodedPayload = base64Url(JSON.stringify(payload))

  const data = `${encodedHeader}.${encodedPayload}`

  const signature = createHmac('sha256', secret).update(data).digest()

  return `${data}.${base64Url(signature)}`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const auth = await requireAuth(req)

    if (!auth.authenticated) {
      return res.status(401).json({
        error: 'Unauthorized',
      })
    }

    const token = createJwt(auth.identity.id)

    return res.status(200).json({
      token,
    })
  } catch {
    return res.status(500).json({
      error: 'Internal server error',
    })
  }
}
