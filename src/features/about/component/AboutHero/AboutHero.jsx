import { motion } from 'motion/react'



import './AboutHero.css'
import useScrollParallax from '../../../../hooks/about/useScrollParallax'
import NoiseField from '../NoiseField/NoiseField'

function AboutHero() {
    const titleRef =
        useScrollParallax(-0.08)

    const descriptionRef =
        useScrollParallax(0.16)

    return (
        <section className="about-hero">
            <NoiseField />
            <div className="about-hero__content">

                <motion.div
                    className="about-hero__eyebrow"
                    initial={{
                        opacity: 0,
                        y: 20,
                        filter: 'blur(8px)',
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                    }}
                    transition={{
                        duration: 1.2,
                        delay: 0.2,
                        ease: [
                            0.16,
                            1,
                            0.3,
                            1,
                        ],
                    }}
                >
                    ДРУГОЙ СПОСОБ ОБЩЕНИЯ
                </motion.div>
                <div
                    ref={titleRef}
                    className="about-hero__title"
                >
                    <motion.span
                        initial={{
                            opacity: 0,
                            x: -100,
                            filter: 'blur(12px)',
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            filter: 'blur(0px)',
                        }}
                        transition={{
                            duration: 1.5,
                            delay: 0.3,
                            ease: [
                                0.16,
                                1,
                                0.3,
                                1,
                            ],
                        }}
                    >
                       НАМ НЕ НУЖНО
                    </motion.span>
                    <motion.span
                        initial={{
                            opacity: 0,
                            x: 100,
                            filter: 'blur(12px)',
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            filter: 'blur(0px)',
                        }}
                        transition={{
                            duration: 1.7,
                            delay: 0.45,
                            ease: [
                                0.16,
                                1,
                                0.3,
                                1,
                            ],
                        }}
                    >
                        БОЛЬШЕ ШУМА.
                    </motion.span>
                </div>
                <motion.p
                    ref={descriptionRef}
                    className="about-hero__description"
                    initial={{
                        opacity: 0,
                        y: 30,
                        filter: 'blur(8px)',
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                    }}
                    transition={{
                        duration: 1.4,
                        delay: 0.75,
                        ease: [
                            0.16,
                            1,
                            0.3,
                            1,
                        ],
                    }}
                >
                    MORSE.CHAT — приватное
                    пространство, где общение
                    возвращается к своему
                    простому состоянию:
                    человек, сообщение и время.
                </motion.p>
            </div>
        </section>
    )
}

export default AboutHero