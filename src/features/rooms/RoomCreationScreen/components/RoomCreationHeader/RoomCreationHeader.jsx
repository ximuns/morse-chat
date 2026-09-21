import { motion } from 'motion/react'

import './RoomCreationHeader.css'


function RoomCreationHeader({
    onBack,
}) {

    return (
        <motion.div
            className="room-creation-header"
            initial={{
                opacity: 0,
                x: -40,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            transition={{
                duration: 0.65,
                delay: 0.45,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            <button
                className="room-creation-header__back"
                type="button"
                onClick={onBack}
            >
                ←
            </button>
            <div className="room-creation-header__label">
                Новая комната
            </div>
        </motion.div>
    )
}


export default RoomCreationHeader