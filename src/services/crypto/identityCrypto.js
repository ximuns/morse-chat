const ALGORITHM = {
  name: 'ECDSA',
  namedCurve: 'P-256',
}

const SIGN_ALGORITHM = {
  name: 'ECDSA',
  hash: 'SHA-256',
}

export async function generateKeyPair() {
  const keyPair = await crypto.subtle.generateKey(ALGORITHM, false, ['sign', 'verify'])

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  }
}

export async function exportPublicKey(publicKey) {
  const exported = await crypto.subtle.exportKey('spki', publicKey)

  return arrayBufferToBase64(exported)
}

export async function signChallenge(privateKey, challenge) {
  const data = new TextEncoder().encode(challenge)

  const signature = await crypto.subtle.sign(SIGN_ALGORITHM, privateKey, data)

  return arrayBufferToBase64(signature)
}

export async function verifySignature(publicKey, challenge, signatureBase64) {
  const data = new TextEncoder().encode(challenge)

  const signature = base64ToArrayBuffer(signatureBase64)

  return crypto.subtle.verify(SIGN_ALGORITHM, publicKey, signature, data)
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)

  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64)

  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes.buffer
}
