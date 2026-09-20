import {
    VERTICAL_LINES,
    HORIZON_Y,
    BOTTOM_Y,
} from '../../geometry'

function TopParticles() {
    return (
        <g className="top__particles">
            {VERTICAL_LINES.map((lineX, lineIndex) => {
                const endX =
                    500 + lineX * 4000

                const distanceFromCenter =
                    Math.abs(lineX)

                const isCenter =
                    distanceFromCenter < 0.15

                const pointsCount =
                    34 +
                    Math.round(
                        (1 - Math.min(distanceFromCenter, 1)) * 10
                    )

                return Array.from({
                    length: pointsCount,
                }).map((_, pointIndex) => {
                    const rawProgress =
                        pointIndex /
                        (pointsCount - 1)

                    const progress =
                        Math.pow(
                            rawProgress,
                            1.65
                        )

                    const y =
                        HORIZON_Y +
                        (BOTTOM_Y - HORIZON_Y) *
                        progress

                    const x =
                        500 +
                        (endX - 500) *
                        progress

                    const seed =
                        Math.abs(
                            Math.sin(
                                lineIndex * 91.73 +
                                pointIndex * 17.31
                            )
                        )

                    const jitter =
                        seed *
                        (0.5 + progress * 1.8)

                    const radius =
                        0.65 +
                        progress * 1.35

                    let opacity =
                        0.08 +
                        progress * 0.42

                    if (isCenter) {
                        opacity += 0.18
                    }

                    const visibilitySeed =
                        Math.sin(
                            lineIndex * 31.17 +
                            pointIndex * 7.91
                        )

                    if (visibilitySeed > 0.72) {
                        opacity *= 0.25
                    }

                    if (visibilitySeed < -0.86) {
                        opacity *= 0.55
                    }

                    return (
                        <circle
                            key={`${lineIndex}-${pointIndex}`}
                            className="top__particle"
                            cx={x + jitter}
                            cy={y}
                            r={radius}
                            style={{
                                opacity,
                                animationDelay:
                                    `${(
                                        lineIndex * 0.13 +
                                        pointIndex * 0.07
                                    ) % 4}s`,
                            }}
                        />
                    )
                })
            })}
        </g>
    )
}

export default TopParticles