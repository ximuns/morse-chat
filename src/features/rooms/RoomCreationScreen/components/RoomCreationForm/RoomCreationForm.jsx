import { useState } from 'react'
import { motion } from 'motion/react'

import './RoomCreationForm.css'

function generateCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

  let result = ''

  for (let index = 0; index < 6; index++) {
    result += characters[Math.floor(Math.random() * characters.length)]
  }

  return result
}

function RoomCreationForm() {
  const [roomName, setRoomName] = useState('')

  const [inviteCode, setInviteCode] = useState(generateCode())

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
        <div className="room-form__eyebrow">СОЗДАТЬ КОМНАТУ</div>

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
          <span className="room-form__label">НАЗВАНИЕ КОМНАТЫ</span>
          <input
            className="room-form__input"
            type="text"
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            placeholder="Введите название"
            maxLength={32}
          />
        </label>
        <div className="room-form__field">
          <span className="room-form__label">КОД ПРИГЛАШЕНИЯ</span>
          <div className="room-form__code-row">
            <input
              className="room-form__input room-form__input--code"
              type="text"
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
              maxLength={12}
            />
            <button
              className="room-form__regenerate"
              type="button"
              onClick={() => setInviteCode(generateCode())}
            >
              ↻
            </button>
          </div>
        </div>
        <button className="room-form__submit" type="button">
          <span>СОЗДАТЬ КОМНАТУ</span>
          <span>→</span>
        </button>
      </motion.div>
    </div>
  )
}

export default RoomCreationForm
