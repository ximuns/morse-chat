import { motion } from 'motion/react'
import './AboutPrivate.css'

const items = [
    {
        number: '01',
        title: 'БЕЗ ЛЕНТЫ',
        reveal: 'ТОЛЬКО ДИАЛОГ',
        description:
            'Нет бесконечной ленты, которая пытается удержать твоё внимание.',
        morse: '· — · ·',
    },
    {
        number: '02',
        title: 'БЕЗ АЛГОРИТМА',
        reveal: 'ТЫ РЕШАЕШЬ САМ',
        description:
            'Никто не решает за тебя, что должно появиться следующим.',
        morse: '— · — ·',
    },
    {
        number: '03',
        title: 'БЕЗ ПУБЛИКИ',
        reveal: 'ТОЛЬКО ВАШИ',
        description:
            'Комната существует только для тех, кого ты пригласил.',
        morse: '— — · ·',
    },
    {
        number: '04',
        title: 'БЕЗ ОТВЛЕЧЕНИЙ',
        reveal: 'ТОЛЬКО СИГНАЛ',
        description:
            'Ничего лишнего между человеком и его сообщением.',
        morse: '· · — ·',
    },
]

function PrivateItem({ item, index }) {
    function handlePointerMove(event) {
        const rect = event.currentTarget.getBoundingClientRect()

        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        event.currentTarget.style.setProperty(
            '--private-x',
            `${x}px`
        )

        event.currentTarget.style.setProperty(
            '--private-y',
            `${y}px`
        )
    }

    function handlePointerLeave(event) {
        event.currentTarget.style.setProperty(
            '--private-x',
            '50%'
        )

        event.currentTarget.style.setProperty(
            '--private-y',
            '50%'
        )
    }

    return (
        <motion.article
            className="private-item"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            initial={{
                opacity: 0,
                y: 70,
                filter: 'blur(10px)',
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
            }}
            viewport={{
                once: true,
                amount: 0.25,
            }}
            transition={{
                duration: 1.2,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            <div className="private-item__number">
                {item.number}
            </div>

            <div className="private-item__content">
                <div className="private-item__morse">
                    {item.morse}
                </div>

                <div className="private-item__headline">
                    <div className="private-item__base">
                        {item.title}
                    </div>

                    <div className="private-item__reveal">
                        {item.reveal}
                    </div>
                </div>

                <p className="private-item__description">
                    {item.description}
                </p>
            </div>

            <div className="private-item__meta">
                <span>ПРИВАТНО</span>
                <span>0{index + 1}</span>
            </div>

            <div className="private-item__scanner" />
        </motion.article>
    )
}

function AboutPrivate() {
    return (
        <section className="about-private">
            <div className="about-private__header">
                <div className="about-private__number">
                    03
                </div>

                <div className="about-private__label">
                    ПРИВАТНОСТЬ ПО УМОЛЧАНИЮ
                </div>

                <div className="about-private__intro">
                    <h2>
                        ТОЛЬКО
                        <br />
                        ТО, ЧТО
                        <br />
                        ВАЖНО.
                    </h2>

                    <p>
                        Мы не добавляем функции ради функций.
                        Мы убираем всё, что мешает разговору
                        оставаться разговором.
                    </p>
                </div>
            </div>

            <div className="about-private__statement">
                <div className="about-private__statement-line">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>

                <span>
                    УБИРАЕМ ЛИШНЕЕ
                </span>
            </div>

            <div className="about-private__items">
                {items.map((item, index) => (
                    <PrivateItem
                        key={item.number}
                        item={item}
                        index={index}
                    />
                ))}
            </div>

            <div className="about-private__bottom">
                <div className="about-private__bottom-signal">
                    <span>·</span>
                    <span>—</span>
                    <span>·</span>
                    <span>·</span>
                    <span>—</span>
                    <span>·</span>
                    <span>—</span>
                </div>

                <div className="about-private__bottom-text">
                    <span>СОСТОЯНИЕ КОМНАТЫ</span>
                    <strong>
                        ПРИВАТНАЯ / ТОЛЬКО ПО ПРИГЛАШЕНИЮ
                    </strong>
                </div>

                <div className="about-private__bottom-counter">
                    04 ПАРАМЕТРА
                </div>
            </div>
        </section>
    )
}

export default AboutPrivate