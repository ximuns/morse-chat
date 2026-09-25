import { supabase } from '../../lib/supabase/client'
import { apiRequest } from '../../lib/api/apiClient'

async function getRealtimeToken() {
  const result = await apiRequest('/api/realtime/token')

  return result.token
}

export async function subscribeToRoom(roomId, onMessage) {
  const token = await getRealtimeToken()

  supabase.realtime.setAuth(token)

  const channel = supabase
    .channel(`room:${roomId}`, {
      config: {
        private: true,
      },
    })
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        const message = payload.new

        onMessage?.({
          id: message.id,
          roomId: message.room_id,
          senderId: message.sender_id,
          morse: message.morse,
          createdAt: message.created_at,
        })
      },
    )

  await new Promise((resolve, reject) => {
    channel.subscribe((status, error) => {
      if (status === 'SUBSCRIBED') {
        resolve()
        return
      }

      if (status === 'CHANNEL_ERROR') {
        reject(error ?? new Error('Realtime channel error'))
        return
      }

      if (status === 'TIMED_OUT') {
        reject(new Error('Realtime connection timed out'))
      }
    })
  })

  const refreshTimer = setInterval(
    async () => {
      try {
        const nextToken = await getRealtimeToken()

        supabase.realtime.setAuth(nextToken)
      } catch {
        return
      }
    },
    4 * 60 * 1000,
  )

  return async () => {
    clearInterval(refreshTimer)
    await supabase.removeChannel(channel)
  }
}
