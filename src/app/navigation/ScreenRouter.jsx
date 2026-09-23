import { useState } from 'react'
import { AnimatePresence } from 'motion/react'

import HomeScreen from '../../features/home/HomeScreen'
import RoomCreationScreen from '../../features/rooms/RoomCreationScreen/RoomCreationScreen'
import RoomsScreen from '../../features/rooms/RoomScreen/RoomScreen'
import AboutScreen from '../../features/about/AboutScreen'
import ChatScreen from '../../features/chat/ChatScreen/ChatScreen'

import AnimatedScreen from './AnimatedScreen'

function ScreenRouter() {
    const [screen, setScreen] = useState('home')
    const [activeRoom, setActiveRoom] = useState(null)

    function handleJoinRoom(code) {
        console.log('JOIN ROOM:', code)
    }

    function handleEnterRoom(room) {
        setActiveRoom(room)
        setScreen('chat')
    }

    const showHome =
        screen === 'home' ||
        screen === 'rooms'

    return (
        <>
            <AnimatePresence mode="wait">

                {showHome && (
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

                {screen === 'chat' && (
                    <AnimatedScreen
                        key="chat"
                        className="scene--chat"
                    >
                        <ChatScreen
                            room={activeRoom}
                            onBack={() =>
                                setScreen('rooms')
                            }
                        />
                    </AnimatedScreen>
                )}

            </AnimatePresence>

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
        </>
    )
}

export default ScreenRouter