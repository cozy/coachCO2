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

// The speed is given in m/s
export const formatAvgSpeed = avgSpeed => `${Math.round(avgSpeed * 3.6)} km/h`

export const formatDate = ({ f, lang, date }) => {
  if (lang === 'fr') {
    return f(date, 'HH[h]mm')
  }
  return f(date, 'HH:mm')
}
