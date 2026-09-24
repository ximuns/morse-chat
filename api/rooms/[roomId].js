import {
  requireAuth,
  supabase,
} from '../_lib/auth.js'

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

    const { roomId } = req.query

    if (typeof roomId !== 'string') {
      return res.status(400).json({
        error: 'Invalid room',
      })
    }

    const { data: membership, error: memberError } =
      await supabase
        .from('room_members')
        .select('room_id, left_at')
        .eq('room_id', roomId)
        .eq('identity_id', auth.identity.id)
        .maybeSingle()

    if (memberError) {
      return res.status(500).json({
        error: 'Database error',
      })
    }

    if (
      !membership ||
      membership.left_at
    ) {
      return res.status(403).json({
        error: 'Access denied',
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
        .eq('id', roomId)
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

    const { data: members, error: membersError } =
      await supabase
        .from('room_members')
        .select(`
          identity_id,
          joined_at,
          identities (
            id,
            callsign
          )
        `)
        .eq('room_id', roomId)
        .is('left_at', null)

    if (membersError) {
      return res.status(500).json({
        error: 'Failed to load members',
      })
    }

    return res.status(200).json({
      room,
      members: members.map((member) => ({
        identityId: member.identity_id,
        joinedAt: member.joined_at,
        callsign: member.identities?.callsign,
      })),
    })
  } catch {
    return res.status(500).json({
      error: 'Internal server error',
    })
  }
}