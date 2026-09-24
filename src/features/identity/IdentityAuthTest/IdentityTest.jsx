import { useEffect, useState } from 'react'
import { createIdentity, loadIdentity } from '../../../services/identity/identityService'

function IdentityTest() {
  const [identity, setIdentity] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function init() {
      try {
        let current = await loadIdentity()

        if (!current) {
          current = await createIdentity('TEST')
        }

        setIdentity(current)
        console.log('Identity:', current)
      } catch (error) {
        console.error(error)
        setError(error.message)
      }
    }

    init()
  }, [])

  if (error) {
    return <div>Ошибка: {error}</div>
  }

  if (!identity) {
    return <div>Создание Identity...</div>
  }

  return (
    <div>
      <div>CALLSIGN: {identity.callsign}</div>
      <div>IDENTITY: {identity.identityId}</div>
      <div>PUBLIC KEY: {identity.publicKey}</div>
    </div>
  )
}

export default IdentityTest