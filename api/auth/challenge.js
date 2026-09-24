import { createHash, randomBytes } from 'node:crypto'
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

function hashChallenge(challenge) {
    return createHash('sha256')
        .update(challenge)
        .digest('hex')
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
        })
    }

    try {
        const { identityId } = req.body ?? {}

        if (typeof identityId !== 'string') {
            return res.status(400).json({
                error: 'Invalid identity',
            })
        }

        const { data: identity, error: identityError } =
            await supabase
                .from('identities')
                .select('id, revoked_at')
                .eq('id', identityId)
                .maybeSingle()

        if (identityError) {
            return res.status(500).json({
                error: 'Database error',
            })
        }

        if (!identity || identity.revoked_at) {
            return res.status(404).json({
                error: 'Identity not found',
            })
        }

        const challenge = randomBytes(32).toString('base64url')
        const challengeHash = hashChallenge(challenge)

        const expiresAt = new Date(
            Date.now() + 60 * 1000
        ).toISOString()

        const { data, error } = await supabase
            .from('challenges')
            .insert({
                identity_id: identityId,
                challenge_hash: challengeHash,
                expires_at: expiresAt,
            })
            .select('id, expires_at')
            .single()

        if (error) {
            return res.status(500).json({
                error: 'Failed to create challenge',
            })
        }

        return res.status(200).json({
            challenge,
            challengeId: data.id,
            expiresAt: data.expires_at,
        })
    } catch {
        return res.status(500).json({
            error: 'Internal server error',
        })
    }
}