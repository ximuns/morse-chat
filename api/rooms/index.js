import { randomInt } from 'node:crypto'
import { requireAuth, supabase } from '../_lib/auth.js'

const ROOM_CODE_CHARACTERS =
  'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateRoomCode(length = 6) {
  let code = ''

  for (let index = 0; index < length; index++) {
    code += ROOM_CODE_CHARACTERS[
      randomInt(ROOM_CODE_CHARACTERS.length)
    ]
  }

  return code
}

async function createUniqueRoomCode() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateRoomCode()

    const { data, error } = await supabase
      .from('rooms')
      .select('id')
      .eq('code', code)
      .maybeSingle()

    if (error) {
      throw new Error('Database error')
    }

    if (!data) {
      return code
    }
  }

  throw new Error('Failed to generate room code')
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return createRoom(req, res)
  }

  if (req.method === 'GET') {
    return listRooms(req, res)
  }

  return res.status(405).json({
    error: 'Method not allowed',
  })
}

async function createRoom(req, res) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authenticated) {
      return res.status(401).json({
        error: 'Unauthorized',
      })
    }

    const { name } = req.body ?? {}

    if (typeof name !== 'string') {
      return res.status(400).json({
        error: 'Invalid room name',
      })
    }

    const normalizedName = name.trim()

    if (
      !normalizedName ||
      normalizedName.length > 32
    ) {
      return res.status(400).json({
        error: 'Invalid room name',
      })
    }

    const code = await createUniqueRoomCode()

    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString()

    const { data: room, error: roomError } =
      await supabase
        .from('rooms')
        .insert({
          code,
          name: normalizedName,
          owner_id: auth.identity.id,
          expires_at: expiresAt,
        })
        .select(`
          id,
          code,
          name,
          owner_id,
          created_at,
          expires_at
        `)
        .single()

    if (roomError) {
      return res.status(400).json({
        error: roomError.message,
      })
    }

    const { error: memberError } =
      await supabase
        .from('room_members')
        .insert({
          room_id: room.id,
          identity_id: auth.identity.id,
        })

    if (memberError) {
      await supabase
        .from('rooms')
        .delete()
        .eq('id', room.id)

      return res.status(500).json({
        error: 'Failed to add room owner',
      })
    }

    return res.status(201).json({
      room,
    })
  } catch {
    return res.status(500).json({
      error: 'Internal server error',
    })
  }
}

async function listRooms(req, res) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authenticated) {
      return res.status(401).json({
        error: 'Unauthorized',
      })
    }

    const { data: memberships, error: membershipError } =
      await supabase
        .from('room_members')
        .select(`
          room_id,
          joined_at,
          rooms (
            id,
            code,
            name,
            owner_id,
            created_at,
            expires_at,
            deleted_at
          )
        `)
        .eq('identity_id', auth.identity.id)
        .is('left_at', null)

    if (membershipError) {
      return res.status(500).json({
        error: 'Database error',
      })
    }

    const rooms = (memberships ?? [])
      .map((membership) => membership.rooms)
      .filter(Boolean)
      .filter((room) => {
        if (room.deleted_at) {
          return false
        }

        return (
          new Date(room.expires_at).getTime() >
          Date.now()
        )
      })

    return res.status(200).json({
      rooms,
    })
  } catch {
    return res.status(500).json({
      error: 'Internal server error',
    })
  }
}