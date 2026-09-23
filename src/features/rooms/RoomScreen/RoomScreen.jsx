import { motion } from 'motion/react'

import './RoomScreen.css'

function RoomsScreen({
    onBack,
    onEnterRoom,
}) {
    const rooms = []

    const demoRoom = {
        id: '7F3A',
        name: 'NIGHT SIGNAL',
        members: 4,
    }

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
                        <span>
                            ACTIVE ROOMS
                        </span>

                        <strong>
                            {rooms.length.toString().padStart(2, '0')}
                        </strong>
                    </div>

                    {rooms.length === 0 && (
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

                            <h2>
                                Нет активных комнат
                            </h2>

                            <p>
                                Когда появятся доступные
                                комнаты, они будут отображаться
                                здесь.
                            </p>
                        </motion.div>
                    )}

                    <div className="rooms-demo">

                        <div className="rooms-demo__header">
                            <span>
                                DEMO
                            </span>

                            <span>
                                ROOM // {demoRoom.id}
                            </span>
                        </div>

                        <div className="rooms-demo__content">

                            <div className="rooms-demo__info">

                                <span className="rooms-demo__label">
                                    ROOM
                                </span>

                                <h3>
                                    {demoRoom.name}
                                </h3>

                                <div className="rooms-demo__meta">
                                    <span>
                                        {demoRoom.members}
                                    </span>

                                    <span>
                                        MEMBERS
                                    </span>
                                </div>

                            </div>

                            <button
                                type="button"
                                className="rooms-demo__enter"
                                onClick={() =>
                                    onEnterRoom(demoRoom)
                                }
                            >
                                <span>
                                    ВОЙТИ
                                </span>

                                <b>
                                    →
                                </b>
                            </button>

                        </div>

                    </div>

                    <div className="rooms-panel__info">
                        <span className="rooms-panel__info-dot" />

                        DEMONSTRATION MODE
                    </div>

                </div>

                <footer className="rooms-panel__footer">

                    <span>
                        CONNECTION
                    </span>

                    <span>
                        LOCAL
                    </span>

                </footer>

            </motion.aside>

        </main>
    )
}

export default RoomsScreen