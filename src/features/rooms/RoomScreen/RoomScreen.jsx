import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

import { getRooms } from '../../../services/rooms/roomService'

import './RoomScreen.css'

function RoomsScreen({ onBack, onEnterRoom }) {
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadRooms() {
    try {
      setIsLoading(true)
      setError('')

      const result = await getRooms()

      setRooms(result)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  return (
    <main className="rooms-screen">
      <motion.aside
        className="rooms-panel"
        initial={{
          x: '110%',
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        exit={{
          x: '110%',
          opacity: 0,
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="rooms-panel__accent" />

        <header className="rooms-panel__header">
          <div>
            <span className="rooms-panel__eyebrow">
              MORSE / NETWORK
            </span>

            <h1 className="rooms-panel__title">
              КОМНАТЫ
            </h1>
          </div>

          <button
            type="button"
            className="rooms-panel__close"
            onClick={onBack}
            aria-label="Закрыть"
          >
            <span />
            <span />
          </button>
        </header>

        <div className="rooms-panel__signal">
          <span />
          <b />
          <span />
          <span />
          <b />
          <span />
        </div>

        <div className="rooms-panel__content">
          <div className="rooms-panel__section">
            <span>ACTIVE ROOMS</span>

            <strong>
              {rooms.length
                .toString()
                .padStart(2, '0')}
            </strong>
          </div>

          {isLoading && (
            <motion.div
              className="rooms-empty"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
            >
              <div className="rooms-empty__mark">
                <span />
                <span />
                <b />
              </div>

              <h2>СИНХРОНИЗАЦИЯ</h2>

              <p>
                Получаем список комнат...
              </p>
            </motion.div>
          )}

          {!isLoading && error && (
            <motion.div
              className="rooms-empty"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <div className="rooms-empty__mark">
                <span />
                <span />
                <b />
              </div>

              <h2>ОШИБКА СВЯЗИ</h2>

              <p>{error}</p>

              <button
                type="button"
                onClick={loadRooms}
              >
                ПОВТОРИТЬ
              </button>
            </motion.div>
          )}

          {!isLoading &&
            !error &&
            rooms.length === 0 && (
              <motion.div
                className="rooms-empty"
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.15,
                  duration: 0.35,
                }}
              >
                <div className="rooms-empty__mark">
                  <span />
                  <span />
                  <b />
                </div>

                <h2>Нет активных комнат</h2>

                <p>
                  Создайте комнату или
                  войдите по приглашению.
                </p>
              </motion.div>
            )}

          {!isLoading &&
            !error &&
            rooms.map((room) => (
              <motion.article
                className="rooms-demo"
                key={room.id}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >
                <div className="rooms-demo__header">
                  <span>ACTIVE</span>

                  <span>
                    ROOM // {room.code}
                  </span>
                </div>

                <div className="rooms-demo__content">
                  <div className="rooms-demo__info">
                    <span className="rooms-demo__label">
                      ROOM
                    </span>

                    <h3>{room.name}</h3>

                    <div className="rooms-demo__meta">
                      <span>•••</span>

                      <span>ACTIVE</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="rooms-demo__enter"
                    onClick={() =>
                      onEnterRoom(room)
                    }
                  >
                    <span>ВОЙТИ</span>

                    <b>→</b>
                  </button>
                </div>
              </motion.article>
            ))}
        </div>

        <footer className="rooms-panel__footer">
          <span>CONNECTION</span>

          <span>SECURE</span>
        </footer>
      </motion.aside>
    </main>
  )
}

export default RoomsScreen