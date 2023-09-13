import humanizeDuration from 'humanize-duration'

export const formatDistance = distance => {
  let unit = 'm'
  let formatedDistance = distance
  if (distance > 1000) {
    unit = 'km'
    formatedDistance = distance / 1000
  }
  return `${Math.round(formatedDistance)} ${unit}`
}

export const formatCO2 = CO2 => `${Math.round(CO2 * 100) / 100} kg`

export const formatCalories = calories => `${Math.round(calories)} kcal`

export const formatDuration = (duration, lang) => {
  const language = ['fr', 'en'].includes(lang) ? lang : 'en'

  return humanizeDuration(duration * 1000, {
    delimiter: ' ',
    largest: 2,
    round: true,
    units: ['h', 'm'],
    language,
    languages: {
      fr: {
        d: () => 'j',
        h: () => 'h',
        m: () => 'min',
        s: () => 's',
        ms: () => 'ms'
      },
      en: {
        d: () => 'd',
        h: () => 'h',
        m: () => 'min',
        s: () => 's',
        ms: () => 'ms'
      }
    }
  })
}

// The average speed is given in km/h
export const formatAvgSpeed = avgSpeed => `${Math.round(avgSpeed)} km/h`

export const formatDate = ({ f, lang, date }) => {
  if (lang === 'fr') {
    return f(date, 'HH[h]mm')
  }
  return f(date, 'HH:mm')
}

/**
 * Compute the percentage and returns it as a formatted string
 * @param {number} value
 * @param {number} total
 * @returns {string}
 */
export const computeFormatedPercentage = (value, total) => {
  if (total === 0) return '0%'

  const [int, dec] = ((value * 100) / total).toFixed(2).split('.')
  if (dec === '00') return `${int}%`

  return `${int}.${dec}%`
}

/**
 * Get the average speed in km/h from an array of m/s values
 * @param {Array} speeds - The speed values, in m/s
 * @returns {number} The average speed, given in km/h
 */
export const averageSpeedKmH = speeds => {
  const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length
  // The speed is given in m/s
  return avgSpeed * 3.6
}
