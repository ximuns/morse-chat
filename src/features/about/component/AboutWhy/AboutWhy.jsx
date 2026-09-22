import { motion } from 'motion/react'

import './AboutWhy.css'
import ScatterText from './component/ScatterText/ScatterText'

function AboutWhy() {
    return (
        <section className="about-why">
            <div className="about-why__number">
                01
            </div>
            <div className="about-why__layout">
                <div className="about-why__visual">

                    <div className="about-why__headline">

                        <motion.div
                            className="about-why__word about-why__word--large"
                            initial={{
                                opacity: 0,
                                y: 40,
                                filter: 'blur(14px)',
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                filter: 'blur(0px)',
                            }}
                            viewport={{
                                once: true,
                                amount: .5,
                            }}
                            transition={{
                                duration: 1.4,
                                ease: [
                                    .16,
                                    1,
                                    .3,
                                    1,
                                ],
                            }}
                        >
                            <ScatterText
                                scatter={300}
                                rotation={80}
                                duration={1.5}
                            >
                                МЕДЛЕННЕЕ
                            </ScatterText>
                        </motion.div>

                        <motion.div
                            className="about-why__word about-why__word--medium"
                            initial={{
                                opacity: 0,
                                x: 50,
                                filter: 'blur(10px)',
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                                filter: 'blur(0px)',
                            }}
                            viewport={{
                                once: true,
                                amount: .5,
                            }}
                            transition={{
                                duration: 1.3,
                                delay: .15,
                                ease: [
                                    .16,
                                    1,
                                    .3,
                                    1,
                                ],
                            }}
                        >
                            <ScatterText
                                scatter={230}
                                rotation={65}
                                duration={1.4}
                            >
                                ЗНАЧИТ
                            </ScatterText>
                        </motion.div>

                        <motion.div
                            className="about-why__word about-why__word--medium about-why__word--offset"
                            initial={{
                                opacity: 0,
                                x: 70,
                                filter: 'blur(10px)',
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                                filter: 'blur(0px)',
                            }}
                            viewport={{
                                once: true,
                                amount: .5,
                            }}
                            transition={{
                                duration: 1.3,
                                delay: .3,
                                ease: [
                                    .16,
                                    1,
                                    .3,
                                    1,
                                ],
                            }}
                        >
                            <ScatterText
                                scatter={230}
                                rotation={65}
                                duration={1.4}
                            >
                                ЛУЧШЕ.
                            </ScatterText>
                        </motion.div>

                    </div>
                </div>
                <div className="about-why__content">

                    <motion.div
                        className="about-why__label"
                        initial={{
                            opacity: 0,
                            x: 25,
                            filter: 'blur(8px)',
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                            filter: 'blur(0px)',
                        }}
                        viewport={{
                            once: true,
                            amount: .6,
                        }}
                        transition={{
                            duration: 1.2,
                            ease: [
                                .16,
                                1,
                                .3,
                                1,
                            ],
                        }}
                    >
                        <ScatterText
                            scatter={100}
                            rotation={35}
                            duration={1.1}
                        >
                            ПОЧЕМУ МОРЗЕ
                        </ScatterText>
                    </motion.div>


                    <div className="about-why__description">

                        <motion.p
                            initial={{
                                opacity: 0,
                                y: 25,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                amount: .6,
                            }}
                            transition={{
                                duration: 1,
                                delay: .15,
                                ease: [
                                    .16,
                                    1,
                                    .3,
                                    1,
                                ],
                            }}
                        >
                            <ScatterText
                                scatter={75}
                                rotation={25}
                                duration={1}
                            >
                                Большинство современных
                                мессенджеров построены
                                вокруг скорости.
                            </ScatterText>
                        </motion.p>


                        <motion.p
                            initial={{
                                opacity: 0,
                                y: 25,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                amount: .6,
                            }}
                            transition={{
                                duration: 1,
                                delay: .3,
                                ease: [
                                    .16,
                                    1,
                                    .3,
                                    1,
                                ],
                            }}
                        >
                            <ScatterText
                                scatter={75}
                                rotation={25}
                                duration={1}
                            >
                                Написать. Отправить.
                                Получить ответ.
                                Следующее сообщение.
                            </ScatterText>
                        </motion.p>


                        <motion.p
                            initial={{
                                opacity: 0,
                                y: 25,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                amount: .6,
                            }}
                            transition={{
                                duration: 1.1,
                                delay: .45,
                                ease: [
                                    .16,
                                    1,
                                    .3,
                                    1,
                                ],
                            }}
                        >
                            <ScatterText
                                scatter={80}
                                rotation={30}
                                duration={1.1}
                            >
                                MORSE.CHAT меняет
                                этот ритм. Здесь
                                сообщение становится
                                осознанным действием.
                            </ScatterText>
                        </motion.p>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default AboutWhy