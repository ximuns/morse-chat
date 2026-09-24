import {
  generateKeyPair,
  exportPublicKey,
} from '../crypto/identityCrypto'

import {
  saveIdentity,
  getIdentity,
  deleteIdentity,
} from '../../lib/storage/identityStorage'

import { apiRequest } from '../../lib/api/apiClient'

export async function createIdentity(callsign) {
  const normalizedCallsign = callsign.trim()

  if (!normalizedCallsign) {
    throw new Error('CALLSIGN is required')
  }

  if (normalizedCallsign.length > 32) {
    throw new Error('CALLSIGN is too long')
  }

  const existingIdentity = await getIdentity()

  if (existingIdentity) {
    throw new Error('Identity already exists')
  }

  const {
    publicKey,
    privateKey,
  } = await generateKeyPair()

  const publicKeyString =
    await exportPublicKey(publicKey)

  const identityId = crypto.randomUUID()

  const identity = {
    identityId,
    callsign: normalizedCallsign,
    publicKey: publicKeyString,
    privateKey,
    createdAt: new Date().toISOString(),
  }

  await apiRequest('/api/identity/register', {
    method: 'POST',
    body: JSON.stringify({
      identityId,
      callsign: normalizedCallsign,
      publicKey: publicKeyString,
    }),
  })

  await saveIdentity(identity)

  return identity
}

export async function loadIdentity() {
  return getIdentity()
}

export async function removeIdentity() {
  await deleteIdentity()
}