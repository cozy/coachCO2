export const toPercentage = value => {
  if (value >= 0 && value <= 100) {
    return Math.round(value)
  }
  return null
}
