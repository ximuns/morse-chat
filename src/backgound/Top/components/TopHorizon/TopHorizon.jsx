import { HORIZON_Y } from '../../geometry'

function TopHorizon() {
    return (
        <g className="top__horizon">
            {Array.from({ length: 260 }).map((_, index) => {
                const seedX =
                    Math.sin(index * 47.13)

                const seedY =
                    Math.sin(index * 91.73)

                const spread =
                    25 +
                    Math.abs(seedX) * 180

                const x =
                    500 + seedX * spread

                const y =
                    HORIZON_Y +
                    Math.abs(seedY) * 145

                const distance =
                    Math.abs(x - 500)

                const centerFactor =
                    1 -
                    Math.min(
                        distance / 220,
                        1
                    )

                const opacity =
                    0.025 +
                    centerFactor * 0.12

                const radius =
                    0.35 +
                    Math.abs(seedX) * 0.8

                return (
                    <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r={radius}
                        style={{
                            opacity,
                        }}
                    />
                )
            })}
        </g>
    )
}

export default TopHorizon