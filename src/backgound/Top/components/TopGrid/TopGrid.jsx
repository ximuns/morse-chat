import {
    HORIZONTAL_LINES,
    VERTICAL_LINES,
    HORIZON_Y,
    BOTTOM_Y,
} from '../../geometry'

function TopGrid() {
    return (
        <g
            className="top__grid"
            mask="url(#topMask)"
        >
            {HORIZONTAL_LINES.map((position, index) => {
                const y =
                    HORIZON_Y +
                    (BOTTOM_Y - HORIZON_Y) *
                    Math.pow(position, 1.7)

                return (
                    <line
                        key={`horizontal-${index}`}
                        x1="0"
                        y1={y}
                        x2="1000"
                        y2={y}
                    />
                )
            })}

            {VERTICAL_LINES.map((x, index) => {
                const endX =
                    500 + x * 4000

                return (
                    <line
                        key={`vertical-${index}`}
                        x1="500"
                        y1={HORIZON_Y}
                        x2={endX}
                        y2={BOTTOM_Y}
                    />
                )
            })}
        </g>
    )
}

export default TopGrid