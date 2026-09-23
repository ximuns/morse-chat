import { useState } from 'react'
import { AnimatePresence } from 'motion/react'

import HomeScreen from '../../features/home/HomeScreen'
import RoomCreationScreen from '../../features/rooms/RoomCreationScreen/RoomCreationScreen'
import RoomsScreen from '../../features/rooms/RoomScreen/RoomScreen'
import AboutScreen from '../../features/about/AboutScreen'

import AnimatedScreen from './AnimatedScreen'

function ScreenRouter() {
    const [screen, setScreen] = useState('home')

    function handleJoinRoom(code) {
        console.log('JOIN ROOM:', code)
    }

    function handleEnterRoom(room) {
        console.log('ENTER ROOM:', room)
        // Позже:
        // setScreen('chat')
    }

    const isHome = screen === 'home' || screen === 'rooms'

    return (
        <>
            {isHome && (
                <AnimatedScreen
                    key="home"
                    className="scene--home"
                >
                    <HomeScreen
                        onCreateRoom={() =>
                            setScreen('create-room')
                        }

                        onJoinRoom={
                            handleJoinRoom
                        }

                        onAbout={() =>
                            setScreen('about')
                        }

                        onRooms={() =>
                            setScreen('rooms')
                        }
                    />
                </AnimatedScreen>
            )}
            <AnimatePresence>
                {screen === 'rooms' && (
                    <RoomsScreen
                        key="rooms"
                        onBack={() =>
                            setScreen('home')
                        }
                        onEnterRoom={
                            handleEnterRoom
                        }
                    />
                )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
                {screen === 'create-room' && (
                    <AnimatedScreen
                        key="create-room"
                        className="scene--room"
                    >
                        <RoomCreationScreen
                            onBack={() =>
                                setScreen('home')
                            }
                        />
                    </AnimatedScreen>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {screen === 'about' && (
                    <AnimatedScreen
                        key="about"
                        className="scene--about"
                    >
                        <AboutScreen
                            onBack={() =>
                                setScreen('home')
                            }
                        />
                    </AnimatedScreen>
                )}
            </AnimatePresence>
        </>
    )
}

export default ScreenRouter