import { useState } from 'react'

import {
  authenticateIdentity,
} from '../../../services/auth/authService'

import {
  createIdentity,
} from '../../../services/identity/identityService'

import { useAuth } from '../../../state/auth/AuthProvider'

import './IdentityScreen.css'

function IdentityScreen() {
  const {
    refreshAuth,
  } = useAuth()

  const [callsign, setCallsign] = useState('')
  const [status, setStatus] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  async function handleCreate() {
    const value = callsign.trim()

    if (!value) {
      setStatus('Введите CALLSIGN')
      return
    }

    try {
      setIsCreating(true)
      setStatus('Создание identity...')

      await createIdentity(value)

      setStatus('Проверка подписи...')

      await authenticateIdentity()

      await refreshAuth()
    } catch (error) {
      setStatus(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <main className="identity-screen">
      <div className="identity-screen__content">
        <div className="identity-screen__label">
          CRYPTOGRAPHIC IDENTITY
        </div>

        <h1 className="identity-screen__title">
          СОЗДАЙТЕ
          <br />
          ЛИЧНОСТЬ
        </h1>

        <p className="identity-screen__description">
          Ваша криптографическая личность
          <br />
          создаётся непосредственно на устройстве.
        </p>

        <div className="identity-screen__form">
          <input
            className="identity-screen__input"
            type="text"
            value={callsign}
            maxLength={32}
            placeholder="CALLSIGN"
            autoComplete="off"
            onChange={(event) =>
              setCallsign(event.target.value)
            }
            disabled={isCreating}
          />

          <button
            className="identity-screen__button"
            type="button"
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating
              ? 'СОЗДАНИЕ...'
              : 'СОЗДАТЬ ЛИЧНОСТЬ'}
          </button>
        </div>

        {status && (
          <div className="identity-screen__status">
            {status}
          </div>
        )}
      </div>
    </main>
  )
}

export default IdentityScreen