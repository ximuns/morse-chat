import { apiRequest } from '../../lib/api/apiClient'

export async function createRoom(name) {
  const normalizedName = name.trim()

  if (!normalizedName) {
    throw new Error('Введите название комнаты')
  }

  const result = await apiRequest('/api/rooms', {
    method: 'POST',
    body: JSON.stringify({
      name: normalizedName,
    }),
  })

  return result.room
}

export async function getRooms() {
  const result = await apiRequest('/api/rooms')

  return result.rooms ?? []
}

export async function joinRoom(code) {
  const normalizedCode = code.trim().toUpperCase()

  if (!normalizedCode) {
    throw new Error('Введите код комнаты')
  }

  const result = await apiRequest('/api/rooms/join', {
    method: 'POST',
    body: JSON.stringify({
      code: normalizedCode,
    }),
  })

  return result.room
}

export async function getRoom(roomId) {
  const result = await apiRequest(`/api/rooms/${roomId}`)

  return result
}

export async function leaveRoom(roomId) {
  return apiRequest('/api/rooms/leave', {
    method: 'POST',
    body: JSON.stringify({
      roomId,
    }),
  })
}
