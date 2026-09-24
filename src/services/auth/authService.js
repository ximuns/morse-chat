import { apiRequest } from '../../lib/api/apiClient'
import { signChallenge } from '../crypto/identityCrypto'
import { loadIdentity } from '../identity/identityService'

export async function requestChallenge(identityId) {
  return apiRequest('/api/auth/challenge', {
    method: 'POST',
    body: JSON.stringify({
      identityId,
    }),
  })
}

export async function verifyIdentity(
  identity,
  challengeId,
  challenge
) {
  const signature = await signChallenge(
    identity.privateKey,
    challenge
  )

  return apiRequest('/api/auth/verify', {
    method: 'POST',
    body: JSON.stringify({
      challengeId,
      challenge,
      signature,
    }),
  })
}

export async function authenticateIdentity() {
  const identity = await loadIdentity()

  if (!identity) {
    throw new Error('Identity not found')
  }

  const {
    challenge,
    challengeId,
  } = await requestChallenge(identity.identityId)

  return verifyIdentity(
    identity,
    challengeId,
    challenge
  )
}

export async function getCurrentSession() {
  return apiRequest('/api/auth/me')
}

export async function logout() {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
  })
}