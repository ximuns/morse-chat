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

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
        })
    }

    try {
        const { identityId, callsign, publicKey } = req.body ?? {}

        if (
            typeof identityId !== 'string' ||
            typeof callsign !== 'string' ||
            typeof publicKey !== 'string'
        ) {
            return res.status(400).json({
                error: 'Invalid request',
            })
        }

        const normalizedCallsign = callsign.trim()

        if (
            !normalizedCallsign ||
            normalizedCallsign.length > 32
        ) {
            return res.status(400).json({
                error: 'Invalid callsign',
            })
        }

        if (!publicKey || publicKey.length > 4096) {
            return res.status(400).json({
                error: 'Invalid public key',
            })
        }

        const { data, error } = await supabase
            .from('identities')
            .insert({
                id: identityId,
                public_key: publicKey,
                key_algorithm: 'ECDSA-P256-SHA256',
                callsign: normalizedCallsign,
            })
            .select('id, callsign, public_key, key_algorithm, created_at')
            .single()

        if (error) {
            return res.status(400).json({
                error: error.message,
            })
        }

        return res.status(201).json({
            identity: data,
        })
    } catch {
        return res.status(500).json({
            error: 'Internal server error',
        })
    }
}