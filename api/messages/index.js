import { requireAuth, supabase } from '../_lib/auth.js'

function isValidUuid(value) {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  )
}

async function checkMembership(roomId, identityId) {
  const { data, error } = await supabase
    .from('room_members')
    .select('room_id')
    .eq('room_id', roomId)
    .eq('identity_id', identityId)
    .is('left_at', null)
    .maybeSingle()

  if (error) {
    throw new Error('Database error')
  }

  return Boolean(data)
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getMessages(req, res)
  }

  if (req.method === 'POST') {
    return sendMessage(req, res)
  }

  return res.status(405).json({
    error: 'Method not allowed',
  })
}

async function getMessages(req, res) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authenticated) {
      return res.status(401).json({
        error: 'Unauthorized',
      })
    }

    const roomId = req.query?.roomId

    if (!isValidUuid(roomId)) {
      return res.status(400).json({
        error: 'Invalid room ID',
      })
    }

    const isMember = await checkMembership(roomId, auth.identity.id)

    if (!isMember) {
      return res.status(403).json({
        error: 'You are not a member of this room',
      })
    }

    const { data, error } = await supabase
      .from('messages')
      .select(
        `
        id,
        room_id,
        sender_id,
        morse,
        created_at,
        identities (
          id,
          callsign
        )
      `,
      )
      .eq('room_id', roomId)
      .order('created_at', {
        ascending: true,
      })
      .limit(100)

    if (error) {
      return res.status(500).json({
        error: 'Database error',
      })
    }

    const messages = (data ?? []).map((message) => ({
      id: message.id,
      roomId: message.room_id,
      senderId: message.sender_id,
      senderCallsign: message.identities?.callsign ?? 'UNKNOWN',
      morse: message.morse,
      createdAt: message.created_at,
    }))

    return res.status(200).json({
      messages,
    })
  } catch {
    return res.status(500).json({
      error: 'Internal server error',
    })
  }
}

async function sendMessage(req, res) {
  try {
    const auth = await requireAuth(req)

    if (!auth.authenticated) {
      return res.status(401).json({
        error: 'Unauthorized',
      })
    }

    const { roomId, morse } = req.body ?? {}

    if (!isValidUuid(roomId)) {
      return res.status(400).json({
        error: 'Invalid room ID',
      })
    }

    if (typeof morse !== 'string' || !morse.trim()) {
      return res.status(400).json({
        error: 'Invalid message',
      })
    }

    const normalizedMorse = morse.trim()

    if (normalizedMorse.length > 2000) {
      return res.status(400).json({
        error: 'Message is too long',
      })
    }

    const isMember = await checkMembership(roomId, auth.identity.id)

    if (!isMember) {
      return res.status(403).json({
        error: 'You are not a member of this room',
      })
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        sender_id: auth.identity.id,
        morse: normalizedMorse,
      })
      .select(
        `
        id,
        room_id,
        sender_id,
        morse,
        created_at,
        identities (
          id,
          callsign
        )
      `,
      )
      .single()

    if (error) {
      return res.status(500).json({
        error: 'Failed to send message',
      })
    }

    return res.status(201).json({
      message: {
        id: data.id,
        roomId: data.room_id,
        senderId: data.sender_id,
        senderCallsign: data.identities?.callsign ?? 'UNKNOWN',
        morse: data.morse,
        createdAt: data.created_at,
      },
    })
  } catch {
    return res.status(500).json({
      error: 'Internal server error',
    })
  }
}
