import { useState } from 'react'
import { AnimatePresence } from 'motion/react'

import HomeScreen from '../../features/home/HomeScreen'
import RoomCreationScreen from '../../features/rooms/RoomCreationScreen/RoomCreationScreen'

import AnimatedScreen from './AnimatedScreen'

function ScreenRouter() {
    const [screen, setScreen] =
        useState('home')

    return (
        <>
            <AnimatePresence mode="wait">

                {screen === 'home' && (
                    <AnimatedScreen
                        key="home"
                        className="scene--home"
                    >
                        <HomeScreen
                            onCreateRoom={() =>
                                setScreen(
                                    'create-room'
                                )
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

            </AnimatePresence>
        </>
    )
}

export default ScreenRouter