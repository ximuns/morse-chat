import {
  requireAuth,
  supabase,
} from '../_lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

    const { code } = req.body ?? {}

    if (typeof code !== 'string') {
      return res.status(400).json({
        error: 'Invalid room code',
      })
    }

    const normalizedCode =
      code.trim().toUpperCase()

    if (
      !normalizedCode ||
      normalizedCode.length > 16
    ) {
      return res.status(400).json({
        error: 'Invalid room code',
      })
    }

    const { data: room, error: roomError } =
      await supabase
        .from('rooms')
        .select(`
          id,
          code,
          owner_id,
          created_at,
          expires_at,
          deleted_at
        `)
        .eq('code', normalizedCode)
        .maybeSingle()

    if (roomError) {
      return res.status(500).json({
        error: 'Database error',
      })
    }

    if (!room || room.deleted_at) {
      return res.status(404).json({
        error: 'Room not found',
      })
    }

    if (
      room.expires_at &&
      new Date(room.expires_at).getTime() <=
        Date.now()
    ) {
      return res.status(410).json({
        error: 'Room expired',
      })
    }

    const { data: existingMember } =
      await supabase
        .from('room_members')
        .select('room_id, left_at')
        .eq('room_id', room.id)
        .eq('identity_id', auth.identity.id)
        .maybeSingle()

    if (existingMember) {
      if (existingMember.left_at) {
        const { error } = await supabase
          .from('room_members')
          .update({
            left_at: null,
            joined_at: new Date().toISOString(),
          })
          .eq('room_id', room.id)
          .eq('identity_id', auth.identity.id)

        if (error) {
          return res.status(500).json({
            error: 'Failed to join room',
          })
        }
      }
    } else {
      const { error } = await supabase
        .from('room_members')
        .insert({
          room_id: room.id,
          identity_id: auth.identity.id,
        })

      if (error) {
        return res.status(500).json({
          error: 'Failed to join room',
        })
      }
    }

    return res.status(200).json({
      room,
    })
  } catch {
    return res.status(500).json({
      error: 'Internal server error',
    })
  }
}