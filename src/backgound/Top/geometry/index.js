export const HORIZON_Y = 1
export const BOTTOM_Y = 1000

export const HORIZONTAL_LINES = Array.from(
    { length: 10 },
    (_, index) => index / 10
)

export const VERTICAL_LINES = Array.from(
    { length: 40 },
    (_, index) => -1 + (index / 40) * 2
)