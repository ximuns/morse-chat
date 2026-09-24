import {
    createHash,
    createPublicKey,
    randomBytes,
    verify as verifySignature,
} from 'node:crypto'

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

function base64ToBuffer(value) {
    return Buffer.from(value, 'base64')
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
        })
    }

    try {
        const {
            challengeId,
            challenge,
            signature,
        } = req.body ?? {}

        if (
            typeof challengeId !== 'string' ||
            typeof challenge !== 'string' ||
            typeof signature !== 'string'
        ) {
            return res.status(400).json({
                error: 'Invalid request',
            })
        }

        const challengeHash = hashValue(challenge)

        const { data: challengeRow, error: challengeError } =
            await supabase
                .from('challenges')
                .select(`
                    id,
                    identity_id,
                    challenge_hash,
                    expires_at,
                    used_at
                `)
                .eq('id', challengeId)
                .eq('challenge_hash', challengeHash)
                .maybeSingle()

        if (challengeError) {
            return res.status(500).json({
                error: 'Database error',
            })
        }

        if (!challengeRow) {
            return res.status(401).json({
                error: 'Invalid challenge',
            })
        }

        if (challengeRow.used_at) {
            return res.status(401).json({
                error: 'Challenge already used',
            })
        }

        if (
            new Date(challengeRow.expires_at).getTime() <=
            Date.now()
        ) {
            return res.status(401).json({
                error: 'Challenge expired',
            })
        }

        const { data: identity, error: identityError } =
            await supabase
                .from('identities')
                .select(`
                    id,
                    public_key,
                    revoked_at
                `)
                .eq('id', challengeRow.identity_id)
                .maybeSingle()

        if (identityError) {
            return res.status(500).json({
                error: 'Database error',
            })
        }

        if (!identity || identity.revoked_at) {
            return res.status(401).json({
                error: 'Identity unavailable',
            })
        }

        const publicKey = createPublicKey({
            key: base64ToBuffer(identity.public_key),
            format: 'der',
            type: 'spki',
        })

        const valid = verifySignature(
            'sha256',
            Buffer.from(challenge),
            {
                key: publicKey,
                dsaEncoding: 'ieee-p1363',
            },
            base64ToBuffer(signature)
        )

        if (!valid) {
            return res.status(401).json({
                error: 'Invalid signature',
            })
        }

        const { data: updatedChallenge, error: updateError } =
            await supabase
                .from('challenges')
                .update({
                    used_at: new Date().toISOString(),
                })
                .eq('id', challengeId)
                .is('used_at', null)
                .select('id')
                .maybeSingle()

        if (updateError) {
            return res.status(500).json({
                error: 'Failed to consume challenge',
            })
        }

        if (!updatedChallenge) {
            return res.status(401).json({
                error: 'Challenge already used',
            })
        }

        const sessionToken = randomBytes(32).toString('base64url')
        const sessionHash = hashValue(sessionToken)

        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString()

        const { error: sessionError } = await supabase
            .from('sessions')
            .insert({
                identity_id: identity.id,
                token_hash: sessionHash,
                expires_at: expiresAt,
            })

        if (sessionError) {
            return res.status(500).json({
                error: 'Failed to create session',
            })
        }

        const isProduction =
            process.env.NODE_ENV === 'production'

        res.setHeader(
            'Set-Cookie',
            [
                `morse_session=${sessionToken}`,
                'HttpOnly',
                'Path=/',
                'SameSite=Lax',
                `Max-Age=${7 * 24 * 60 * 60}`,
                isProduction ? 'Secure' : '',
            ]
                .filter(Boolean)
                .join('; ')
        )

        return res.status(200).json({
            identityId: identity.id,
            expiresAt,
        })
    } catch {
        return res.status(500).json({
            error: 'Internal server error',
        })
    }
}