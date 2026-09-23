import {
    useEffect,
    useRef,
    useState,
} from 'react'

import {
    AnimatePresence,
    motion,
} from 'motion/react'

import './ChatScreen.css'
import { decodeMorse, encodeText } from '../../../utils/morse'

const HOLD_THRESHOLD = 260
const LETTER_GAP = 1200
const WORD_GAP = 2400

function decodeMessage(morse) {
    if (!morse.trim()) {
        return ''
    }

    return morse
        .split(' / ')
        .map((word) =>
            word
                .split(' ')
                .filter(Boolean)
                .map(decodeMorse)
                .join('')
        )
        .join(' ')
}

function MorseVisual({
    value,
    trailingBoundary = null,
    className = '',
}) {
    const words = value
        .split(' / ')
        .filter(Boolean)

    return (
        <span
            className={`morse-visual ${className}`}
        >
            {words.map(
                (word, wordIndex) => {
                    const letters = word
                        .split(' ')
                        .filter(Boolean)

                    return (
                        <span
                            className="morse-visual__word"
                            key={wordIndex}
                        >
                            {letters.map(
                                (
                                    letter,
                                    letterIndex
                                ) => (
                                    <span
                                        className="morse-visual__letter"
                                        key={letterIndex}
                                    >
                                        {letter
                                            .split('')
                                            .map(
                                                (
                                                    symbol,
                                                    symbolIndex
                                                ) =>
                                                    symbol === '.' ? (
                                                        <span
                                                            className="morse-visual__dot"
                                                            key={
                                                                symbolIndex
                                                            }
                                                        />
                                                    ) : (
                                                        <span
                                                            className="morse-visual__dash"
                                                            key={
                                                                symbolIndex
                                                            }
                                                        />
                                                    )
                                            )}

                                        {letterIndex <
                                            letters.length - 1 && (
                                            <span className="morse-visual__letter-gap">
                                                <i />
                                            </span>
                                        )}
                                    </span>
                                )
                            )}

                            {wordIndex <
                                words.length - 1 && (
                                <span className="morse-visual__word-gap">
                                    <i />
                                </span>
                            )}
                        </span>
                    )
                }
            )}

            {trailingBoundary === 'letter' && (
                <span className="morse-visual__letter-gap morse-visual__letter-gap--trailing">
                    <i />
                </span>
            )}

            {trailingBoundary === 'word' && (
                <span className="morse-visual__word-gap morse-visual__word-gap--trailing">
                    <i />
                </span>
            )}
        </span>
    )
}

function ChatScreen({
    room,
    onBack,
}) {
    const [committedMorse, setCommittedMorse] =
        useState('')

    const [currentCode, setCurrentCode] =
        useState('')

    const [mode, setMode] =
        useState('auto')

    const [gapStage, setGapStage] =
        useState('none')

    const [elapsed, setElapsed] =
        useState(0)

    const [isPressed, setIsPressed] =
        useState(false)

    const [liveSymbol, setLiveSymbol] =
        useState('')

    const [expandedMessages, setExpandedMessages] =
        useState(new Set())

    const [messages, setMessages] =
        useState([
            {
                id: 1,
                type: 'incoming',
                morse: encodeText('ПРИВЕТ'),
            },
            {
                id: 2,
                type: 'outgoing',
                morse: encodeText(
                    'ПРИВЕТ ОЛЕГ'
                ),
            },
        ])

    const currentCodeRef =
        useRef('')

    const gapStageRef =
        useRef('none')

    const modeRef =
        useRef('auto')

    const animationFrameRef =
        useRef(null)

    const gapStartedAtRef =
        useRef(0)

    const pressStartedAt =
        useRef(0)

    const holdTimer =
        useRef(null)

    const displayMorse =
        committedMorse +
        currentCode

    const decodedText =
        decodeMessage(displayMorse)

    const progress =
        Math.min(
            100,
            (elapsed / WORD_GAP) * 100
        )

    const letterReached =
        elapsed >= LETTER_GAP

    const wordReached =
        elapsed >= WORD_GAP

    const trailingBoundary =
        mode === 'auto'
            ? gapStage === 'letter'
                ? 'letter'
                : gapStage === 'word'
                    ? 'word'
                    : null
            : null

    function clearAnimation() {
        if (
            animationFrameRef.current
        ) {
            cancelAnimationFrame(
                animationFrameRef.current
            )

            animationFrameRef.current =
                null
        }
    }

    function clearHoldTimer() {
        if (holdTimer.current) {
            clearTimeout(
                holdTimer.current
            )

            holdTimer.current = null
        }
    }

    function finalizeLetter() {
        const code =
            currentCodeRef.current

        if (!code) {
            return
        }

        setCommittedMorse(
            (value) =>
                value
                    ? `${value} ${code}`
                    : code
        )

        setCurrentCode('')

        currentCodeRef.current =
            ''

        setGapStage('letter')

        gapStageRef.current =
            'letter'
    }

    function startGapTimer() {
        clearAnimation()

        if (
            modeRef.current !== 'auto'
        ) {
            return
        }

        gapStartedAtRef.current =
            performance.now()

        setElapsed(0)
        setGapStage('waiting')

        gapStageRef.current =
            'waiting'

        function tick(now) {
            const elapsedNow =
                now -
                gapStartedAtRef.current

            if (
                elapsedNow >=
                WORD_GAP
            ) {
                setElapsed(
                    WORD_GAP
                )

                setGapStage('word')

                gapStageRef.current =
                    'word'

                clearAnimation()

                return
            }

            if (
                elapsedNow >=
                    LETTER_GAP &&
                gapStageRef.current ===
                    'waiting'
            ) {
                finalizeLetter()
            }

            setElapsed(elapsedNow)

            animationFrameRef.current =
                requestAnimationFrame(
                    tick
                )
        }

        animationFrameRef.current =
            requestAnimationFrame(tick)
    }

    function handleSignal(symbol) {
        clearAnimation()

        if (
            modeRef.current === 'auto'
        ) {
            if (
                gapStageRef.current ===
                    'letter'
            ) {
                setCommittedMorse(
                    (value) =>
                        value
                            ? `${value} `
                            : value
                )
            }

            if (
                gapStageRef.current ===
                    'word'
            ) {
                setCommittedMorse(
                    (value) =>
                        value
                            ? `${value} / `
                            : value
                )
            }
        }

        setGapStage('none')

        gapStageRef.current =
            'none'

        setElapsed(0)

        setCurrentCode(
            (value) =>
                `${value}${symbol}`
        )

        currentCodeRef.current +=
            symbol

        setLiveSymbol(symbol)

        startGapTimer()
    }

    function handlePointerDown(event) {
        event.currentTarget.setPointerCapture(
            event.pointerId
        )

        clearHoldTimer()

        pressStartedAt.current =
            performance.now()

        setIsPressed(true)

        setLiveSymbol('.')

        holdTimer.current =
            setTimeout(() => {
                setLiveSymbol('-')
            }, HOLD_THRESHOLD)
    }

    function handlePointerUp(event) {
        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId
            )
        }

        clearHoldTimer()

        const duration =
            performance.now() -
            pressStartedAt.current

        const symbol =
            duration >=
            HOLD_THRESHOLD
                ? '-'
                : '.'

        setIsPressed(false)

        handleSignal(symbol)
    }

    function handlePointerCancel() {
        clearHoldTimer()

        setIsPressed(false)
        setLiveSymbol('')
    }

    function handleManualLetter() {
        const code =
            currentCodeRef.current

        if (!code) {
            return
        }

        setCommittedMorse(
            (value) =>
                value
                    ? `${value} ${code}`
                    : code
        )

        setCurrentCode('')

        currentCodeRef.current =
            ''

        setGapStage('none')

        gapStageRef.current =
            'none'

        setElapsed(0)
    }

    function handleManualWord() {
        const code =
            currentCodeRef.current

        if (code) {
            setCommittedMorse(
                (value) =>
                    value
                        ? `${value} ${code} / `
                        : `${code} / `
            )

            setCurrentCode('')

            currentCodeRef.current =
                ''
        }

        setGapStage('none')

        gapStageRef.current =
            'none'

        setElapsed(0)
    }

    function toggleMode() {
        clearAnimation()

        const nextMode =
            modeRef.current === 'auto'
                ? 'manual'
                : 'auto'

        modeRef.current =
            nextMode

        setMode(nextMode)

        setGapStage('none')

        gapStageRef.current =
            'none'

        setElapsed(0)
    }

    function toggleMessage(messageId) {
        setExpandedMessages(
            (current) => {
                const next = new Set(
                    current
                )

                if (
                    next.has(messageId)
                ) {
                    next.delete(
                        messageId
                    )
                } else {
                    next.add(
                        messageId
                    )
                }

                return next
            }
        )
    }

    function handleSend() {
        const finalMorse =
            (
                committedMorse +
                currentCode
            )
                .replace(
                    /\s+/g,
                    ' '
                )
                .replace(
                    /\s*\/\s*/g,
                    ' / '
                )
                .trim()

        if (!finalMorse) {
            return
        }

        setMessages((value) => [
            ...value,
            {
                id: Date.now(),
                type: 'outgoing',
                morse: finalMorse,
            },
        ])

        setCommittedMorse('')
        setCurrentCode('')

        currentCodeRef.current =
            ''

        setGapStage('none')

        gapStageRef.current =
            'none'

        setElapsed(0)

        clearAnimation()
    }

    useEffect(() => {
        modeRef.current = mode
    }, [mode])

    useEffect(() => {
        return () => {
            clearAnimation()
            clearHoldTimer()
        }
    }, [])

    return (
        <main className="chat-screen">

            <div className="chat-screen__ambient" />

            <section className="chat">

                <header className="chat__header">

                    <div className="chat__inner">

                        <div className="chat__room">

                            <span className="chat__eyebrow">
                                МОРЗЕ / КОМНАТА
                            </span>

                            <h1 className="chat__title">
                                {room?.name ||
                                    'NIGHT SIGNAL'}
                            </h1>

                            <span className="chat__room-id">
                                КОМНАТА //{' '}
                                {room?.id ||
                                    '7F3A'}
                            </span>

                        </div>

                        <button
                            type="button"
                            className="chat__close"
                            onClick={onBack}
                            aria-label="Выйти из комнаты"
                        >
                            <span />
                            <span />
                        </button>

                    </div>

                </header>

                <div className="chat__messages">

                    <div className="chat__inner chat__messages-inner">

                        {messages.map(
                            (message) => {
                                const isExpanded =
                                    expandedMessages.has(
                                        message.id
                                    )

                                return (
                                    <motion.article
                                        className={`message message--${message.type} ${
                                            isExpanded
                                                ? 'message--expanded'
                                                : ''
                                        }`}
                                        key={
                                            message.id
                                        }
                                        layout
                                        onClick={() =>
                                            toggleMessage(
                                                message.id
                                            )
                                        }
                                        transition={{
                                            layout: {
                                                duration: 0.28,
                                                ease: [
                                                    0.22,
                                                    1,
                                                    0.36,
                                                    1,
                                                ],
                                            },
                                        }}
                                    >

                                        <div className="message__top">

                                            <span>
                                                {message.type ===
                                                'incoming'
                                                    ? 'ВХОДЯЩЕЕ'
                                                    : 'ИСХОДЯЩЕЕ'}
                                            </span>

                                            <span>
                                                {isExpanded
                                                    ? 'СКРЫТЬ'
                                                    : 'ПЕРЕВЕСТИ'}
                                            </span>

                                        </div>

                                        <MorseVisual
                                            value={
                                                message.morse
                                            }
                                            className="message__morse"
                                        />

                                        <AnimatePresence
                                            initial={
                                                false
                                            }
                                        >
                                            {isExpanded && (
                                                <motion.div
                                                    className="message__translated"
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                        marginTop: 0,
                                                        y: -5,
                                                    }}
                                                    animate={{
                                                        opacity: 0.68,
                                                        height: 'auto',
                                                        marginTop: 14,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        height: 0,
                                                        marginTop: 0,
                                                        y: -5,
                                                    }}
                                                    transition={{
                                                        duration: 0.24,
                                                        ease: [
                                                            0.22,
                                                            1,
                                                            0.36,
                                                            1,
                                                        ],
                                                    }}
                                                >
                                                    {
                                                        decodeMessage(
                                                            message.morse
                                                        )
                                                    }
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <span className="message__hint">
                                            {isExpanded
                                                ? 'НАЖМИТЕ, ЧТОБЫ СКРЫТЬ'
                                                : 'НАЖМИТЕ, ЧТОБЫ ПЕРЕВЕСТИ'}
                                        </span>

                                    </motion.article>
                                )
                            }
                        )}

                    </div>

                </div>

                <section className="chat__composer">

                    <div className="chat__inner">

                        <div className="chat__composer-header">

                            <div className="chat__composer-title">

                                <span>
                                    СООБЩЕНИЕ
                                </span>

                                <small>
                                    {mode ===
                                    'auto'
                                        ? 'АВТОМАТИЧЕСКИЕ ПАУЗЫ'
                                        : 'РУЧНЫЕ ПАУЗЫ'}
                                </small>

                            </div>

                            <button
                                type="button"
                                className={`mode-toggle ${
                                    mode ===
                                    'manual'
                                        ? 'mode-toggle--manual'
                                        : ''
                                }`}
                                onClick={
                                    toggleMode
                                }
                            >

                                <span
                                    className={
                                        mode ===
                                        'auto'
                                            ? 'is-active'
                                            : ''
                                    }
                                >
                                    АВТО
                                </span>

                                <i />

                                <span
                                    className={
                                        mode ===
                                        'manual'
                                            ? 'is-active'
                                            : ''
                                    }
                                >
                                    ВРУЧНУЮ
                                </span>

                            </button>

                        </div>

                        <div className="chat__draft">

                            <div className="chat__draft-text">
                                {decodedText ||
                                    'Передайте сигнал ...'}
                            </div>

                            <div className="chat__draft-morse">

                                {displayMorse ? (
                                    <MorseVisual
                                        value={
                                            displayMorse
                                        }
                                        trailingBoundary={
                                            trailingBoundary
                                        }
                                    />
                                ) : (
                                    <span className="chat__draft-empty">
                                        • • •
                                    </span>
                                )}

                            </div>

                        </div>

                        {mode === 'auto' && (
                            <div
                                className={`spacing-timeline ${
                                    gapStage ===
                                    'waiting'
                                        ? 'spacing-timeline--active'
                                        : ''
                                }`}
                            >

                                <div className="spacing-timeline__head">

                                    <span>
                                        {gapStage ===
                                        'waiting'
                                            ? 'ПАУЗА МЕЖДУ СИГНАЛАМИ'
                                            : gapStage ===
                                                'letter'
                                                ? 'БУКВА ЗАВЕРШЕНА'
                                                : gapStage ===
                                                    'word'
                                                    ? 'СЛОВО ЗАВЕРШЕНО'
                                                    : 'АВТОМАТИЧЕСКОЕ РАЗДЕЛЕНИЕ'}
                                    </span>

                                    <strong>
                                        {gapStage ===
                                        'waiting'
                                            ? `${Math.ceil(
                                                Math.max(
                                                    0,
                                                    WORD_GAP -
                                                    elapsed
                                                )
                                            )} мс`
                                            : gapStage ===
                                                'letter'
                                                ? `${LETTER_GAP} мс`
                                                : gapStage ===
                                                    'word'
                                                    ? `${WORD_GAP} мс`
                                                    : 'ГОТОВ'}
                                    </strong>

                                </div>

                                <div className="spacing-timeline__track">

                                    <div
                                        className="spacing-timeline__fill"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />

                                    <div
                                        className="spacing-timeline__cursor"
                                        style={{
                                            left: `${progress}%`,
                                        }}
                                    />

                                    <div
                                        className={`spacing-timeline__point spacing-timeline__point--letter ${
                                            letterReached
                                                ? 'is-active'
                                                : ''
                                        }`}
                                    >
                                        <span />
                                    </div>

                                    <div
                                        className={`spacing-timeline__point spacing-timeline__point--word ${
                                            wordReached
                                                ? 'is-active'
                                                : ''
                                        }`}
                                    >
                                        <span />
                                    </div>

                                </div>

                                <div className="spacing-timeline__labels">

                                    <div>
                                        <span>
                                            0
                                        </span>

                                        <strong>
                                            СИГНАЛ
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            {LETTER_GAP} мс
                                        </span>

                                        <strong>
                                            БУКВА
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            {WORD_GAP} мс
                                        </span>

                                        <strong>
                                            СЛОВО
                                        </strong>
                                    </div>

                                </div>

                            </div>
                        )}

                        {mode === 'manual' && (
                            <div className="manual-spacing">

                                <button
                                    type="button"
                                    onClick={
                                        handleManualLetter
                                    }
                                >
                                    <strong>
                                        БУКВА
                                    </strong>

                                    <span>
                                        отделить
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleManualWord
                                    }
                                >
                                    <strong>
                                        СЛОВО
                                    </strong>

                                    <span>
                                        отделить
                                    </span>
                                </button>

                            </div>
                        )}

                        <button
                            type="button"
                            className={`morse-key ${
                                isPressed
                                    ? 'morse-key--active'
                                    : ''
                            }`}
                            onPointerDown={
                                handlePointerDown
                            }
                            onPointerUp={
                                handlePointerUp
                            }
                            onPointerCancel={
                                handlePointerCancel
                            }
                            onContextMenu={(
                                event
                            ) =>
                                event.preventDefault()
                            }
                        >

                            <span className="morse-key__symbol">
                                {isPressed
                                    ? liveSymbol ===
                                        '-'
                                        ? '—'
                                        : '·'
                                    : '·'}
                            </span>

                            <span className="morse-key__state">
                                {isPressed
                                    ? liveSymbol ===
                                        '-'
                                        ? 'ТИРЕ'
                                        : 'ТОЧКА'
                                    : 'НАЖМИТЕ И ДЕРЖИТЕ'}
                            </span>

                        </button>

                        <button
                            type="button"
                            className="chat__send"
                            onClick={
                                handleSend
                            }
                        >
                            ОТПРАВИТЬ

                            <span>
                                →
                            </span>

                        </button>

                    </div>

                </section>

                <footer className="chat__footer">

                    <div className="chat__inner">

                        <span>
                            {isPressed
                                ? 'ПЕРЕДАЧА'
                                : 'ГОТОВ'}
                        </span>

                        <span>
                            РУ / МОРЗЕ
                        </span>

                    </div>

                </footer>

            </section>

        </main>
    )
}

export default ChatScreen