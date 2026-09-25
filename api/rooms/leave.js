import { requireAuth, supabase } from '../_lib/auth.js'

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

    const { roomId } = req.body ?? {}

    if (typeof roomId !== 'string') {
      return res.status(400).json({
        error: 'Invalid room',
      })
    }

    const { data: membership, error } = await supabase
      .from('room_members')
      .select(
        `
          room_id,
          identity_id,
          rooms (
            owner_id
          )
        `,
      )
      .eq('room_id', roomId)
      .eq('identity_id', auth.identity.id)
      .maybeSingle()

    if (error) {
      return res.status(500).json({
        error: 'Database error',
      })
    }

    if (!membership) {
      return res.status(404).json({
        error: 'Room membership not found',
      })
    }

    if (membership.rooms?.owner_id === auth.identity.id) {
      return res.status(400).json({
        error: 'Room owner cannot leave the room',
      })
    }

    const { error: updateError } = await supabase
      .from('room_members')
      .update({
        left_at: new Date().toISOString(),
      })
      .eq('room_id', roomId)
      .eq('identity_id', auth.identity.id)

    if (updateError) {
      return res.status(500).json({
        error: 'Failed to leave room',
      })
    }

    return res.status(200).json({
      success: true,
    })
  } catch {
    return res.status(500).json({
      error: 'Internal server error',
    })
  }
}
