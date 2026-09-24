import { useState } from 'react'
import { motion } from 'motion/react'

import './RoomCreationForm.css'
import { createRoom } from '../../../../../services/rooms/roomService'

function RoomCreationForm({ onCreated }) {
  const [roomName, setRoomName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    const name = roomName.trim()

    if (!name) {
      setError('Введите название комнаты')
      return
    }

    try {
      setIsCreating(true)
      setError('')

      const room = await createRoom(name)

      onCreated?.(room)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="room-form">
      <motion.div
        className="room-form__heading"
        initial={{
          opacity: 0,
          y: 80,
          scale: 0.94,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          delay: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="room-form__eyebrow">
          СОЗДАТЬ КОМНАТУ
        </div>

        <h1 className="room-form__title">
          НОВАЯ
          <br />
          КОМНАТА
          <span>.</span>
        </h1>
      </motion.div>

      <motion.div
        className="room-form__body"
        initial={{
          opacity: 0,
          y: 100,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.85,
          delay: 0.55,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <label className="room-form__field">
          <span className="room-form__label">
            НАЗВАНИЕ КОМНАТЫ
          </span>

          <input
            className="room-form__input"
            type="text"
            value={roomName}
            onChange={(event) => {
              setRoomName(event.target.value)
              setError('')
            }}
            placeholder="Введите название"
            maxLength={32}
            disabled={isCreating}
            autoComplete="off"
          />
        </label>

        {error && (
          <div className="room-form__error">
            {error}
          </div>
        )}

        <button
          className="room-form__submit"
          type="button"
          onClick={handleCreate}
          disabled={isCreating}
        >
          <span>
            {isCreating
              ? 'СОЗДАНИЕ...'
              : 'СОЗДАТЬ КОМНАТУ'}
          </span>

          <span>→</span>
        </button>
      </motion.div>
    </div>
  )
}

export default RoomCreationForm