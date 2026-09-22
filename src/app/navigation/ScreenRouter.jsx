import { useState } from 'react'
import { AnimatePresence } from 'motion/react'

import HomeScreen from '../../features/home/HomeScreen'
import RoomCreationScreen from '../../features/rooms/RoomCreationScreen/RoomCreationScreen'
import AboutScreen from '../../features/about/AboutScreen'

import AnimatedScreen from './AnimatedScreen'

function ScreenRouter() {

    const [screen, setScreen] =
        useState('home')

    function handleJoinRoom(code) {
        console.log('JOIN ROOM:', code)
    }

    return (
        <AnimatePresence mode="wait">

            {screen === 'home' && (
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

        </AnimatePresence>
    )
}

export default ScreenRouter