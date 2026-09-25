import { useState } from 'react'

import { logout } from '../../../services/auth/authService'

import { removeIdentity } from '../../../services/identity/identityService'

import { useAuth } from '../../../state/auth/AuthProvider'

import './IdentityMenu.css'

function IdentityMenu() {
  const { identity, clearAuthentication } = useAuth()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    try {
      setIsLoading(true)

      await logout()

      clearAuthentication()
      setIsOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(
      'Удалить локальную криптографическую личность с этого устройства?',
    )

    if (!confirmed) {
      return
    }

    try {
      setIsLoading(true)

      await logout()
      await removeIdentity()

      clearAuthentication()
      setIsOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="identity-menu">
      <button
        className="identity-menu__trigger"
        type="button"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="identity-menu__callsign">{identity?.callsign}</span>

        <span className="identity-menu__indicator" />
      </button>

      {isOpen && (
        <div className="identity-menu__panel">
          <div className="identity-menu__identity">
            <span>ЛИЧНОСТЬ</span>
            <strong>{identity?.callsign}</strong>
          </div>

          <div className="identity-menu__identity">
            <span>КОД ВОССТАНОВЛЕНИЯ</span>
            <strong>{identity?.id?.slice(0, 8)}</strong>
          </div>

          <button
            className="identity-menu__action"
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
          >
            ВЫЙТИ
          </button>

          <button
            className="identity-menu__danger"
            type="button"
            onClick={handleReset}
            disabled={isLoading}
          >
            СБРОСИТЬ ЛИЧНОСТЬ
          </button>
        </div>
      )}
    </div>
  )
}

export default IdentityMenu
