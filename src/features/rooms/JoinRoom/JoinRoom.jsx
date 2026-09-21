import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import './JoinRoom.css'


function JoinRoom({
    onJoin,
}) {

    const [isOpen, setIsOpen] =
        useState(false)

    const [code, setCode] =
        useState('')

    const inputRef =
        useRef(null)


    useEffect(() => {

        if (!isOpen) return

        const timer =
            setTimeout(() => {

                inputRef.current?.focus()

            }, 850)


        return () => {
            clearTimeout(timer)
        }

    }, [isOpen])


    function handleOpen() {

        setIsOpen(true)

    }


    function handleClose() {

        setIsOpen(false)

        setCode('')

    }


    function handleChange(event) {

        const value =
            event.target.value
                .toUpperCase()
                .replace(
                    /[^A-Z0-9]/g,
                    ''
                )
                .slice(0, 8)

        setCode(value)

    }


    function handleSubmit(event) {

        event.preventDefault()

        if (!code) return

        onJoin?.(code)

    }


    return (
        <div
            className={[
                'join-room',
                isOpen
                    ? 'join-room--open'
                    : '',
            ].join(' ')}
        >

            <AnimatePresence
                mode="wait"
                initial={false}
            >

                {!isOpen ? (

                    <motion.button
                        key="trigger"

                        className="join-room__trigger"

                        type="button"

                        onClick={handleOpen}

                        initial={{
                            opacity: 1,
                        }}

                        animate={{
                            opacity: 1,
                        }}

                        exit={{
                            opacity: 0,
                            y: -4,
                        }}

                        transition={{
                            duration: 0.38,
                            ease: [
                                0.4,
                                0,
                                0.2,
                                1,
                            ],
                        }}
                    >

                        <span>
                            ВОЙТИ В КОМНАТУ
                        </span>


                        <span className="join-room__arrow">
                            →
                        </span>

                    </motion.button>

                ) : (

                    <motion.form
                        key="form"

                        className="join-room__form"

                        onSubmit={handleSubmit}

                        initial={{
                            opacity: 0,
                            y: 8,
                        }}

                        animate={{
                            opacity: 1,
                            y: 0,
                        }}

                        exit={{
                            opacity: 0,
                            y: -5,
                        }}

                        transition={{
                            duration: 0.65,
                            delay: 0.28,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    >

                        <div className="join-room__top">

                            <motion.span
                                className="join-room__label"

                                initial={{
                                    opacity: 0,
                                    letterSpacing:
                                        '0.1em',
                                }}

                                animate={{
                                    opacity: 1,
                                    letterSpacing:
                                        '0.2em',
                                }}

                                transition={{
                                    duration: 0.65,
                                    delay: 0.5,
                                    ease: 'easeOut',
                                }}
                            >
                                КОД ПРИГЛАШЕНИЯ
                            </motion.span>


                            <motion.button
                                className="join-room__close"

                                type="button"

                                onClick={handleClose}

                                initial={{
                                    opacity: 0,
                                }}

                                animate={{
                                    opacity: 1,
                                }}

                                transition={{
                                    duration: 0.4,
                                    delay: 0.75,
                                }}
                            >
                                ×
                            </motion.button>

                        </div>


                        <div className="join-room__input-row">

                            <input
                                ref={inputRef}

                                className="join-room__input"

                                value={code}

                                onChange={
                                    handleChange
                                }

                                placeholder="ВСТАВЬТЕ КОД"

                                autoComplete="off"

                                spellCheck="false"
                            />


                            <motion.button
                                className={[
                                    'join-room__submit',
                                    code
                                        ? 'join-room__submit--active'
                                        : '',
                                ].join(' ')}

                                type="submit"

                                disabled={!code}

                                animate={{
                                    opacity:
                                        code
                                            ? 1
                                            : 0.25,

                                    x:
                                        code
                                            ? 0
                                            : -2,
                                }}

                                transition={{
                                    duration: 0.35,
                                    ease: 'easeOut',
                                }}
                            >
                                →
                            </motion.button>

                        </div>


                        <div
                            className="join-room__particles"
                        >

                            {Array.from({
                                length: 8,
                            }).map(
                                (_, index) => (
                                    <span
                                        key={index}
                                    />
                                )
                            )}

                        </div>

                    </motion.form>

                )}

            </AnimatePresence>
            <AnimatePresence>

                {isOpen && (

                    <motion.div
                        className="join-room__light"
                        initial={{
                            scaleX: 0,
                            opacity: 0,
                        }}
                        animate={{
                            scaleX: [
                                0,
                                0.25,
                                1,
                                0,
                            ],
                            opacity: [
                                0,
                                0.35,
                                0.12,
                                0,
                            ],
                        }}
                        transition={{
                            duration: 1.15,
                            times: [
                                0,
                                0.25,
                                0.65,
                                1,
                            ],
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    />

                )}

            </AnimatePresence>

        </div>
    )
}


export default JoinRoom