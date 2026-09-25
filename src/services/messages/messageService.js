import { apiRequest } from '../../lib/api/apiClient'

export async function getRoomMessages(roomId) {
  const result = await apiRequest(`/api/messages?roomId=${encodeURIComponent(roomId)}`)

  return result.messages ?? []
}

export async function sendMessage(roomId, morse) {
  const result = await apiRequest('/api/messages', {
    method: 'POST',
    body: JSON.stringify({
      roomId,
      morse,
    }),
  })

  return result.message
}
