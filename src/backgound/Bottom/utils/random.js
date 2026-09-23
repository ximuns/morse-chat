export function random(row, column, side) {
  const value = Math.sin(row * 127.31 + column * 71.17 + side * 43.91) * 43758.5453

  return value - Math.floor(value)
}
