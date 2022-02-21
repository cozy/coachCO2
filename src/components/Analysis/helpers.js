import { modeToColor } from 'src/components/helpers'
import { formatCO2 } from 'src/lib/trips'

export const makeChartProps = (timeseriesSortedByModes, t) => {
  const timeseriesData = Object.values(timeseriesSortedByModes).map(
    modeValues => modeValues.totalCO2
  )
  const colors = Object.keys(timeseriesSortedByModes).map(el => modeToColor(el))
  const labels = Object.keys(timeseriesSortedByModes).map(el =>
    t(`trips.modes.${el}`)
  )

  const data = {
    labels,
    datasets: [
      {
        id: 1,
        data: timeseriesData,
        backgroundColor: colors
      }
    ]
  }

  const options = {
    cutout: '75%',
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: tooltipItems =>
            `${tooltipItems.label} ${formatCO2(tooltipItems.raw)}`
        }
      }
    }
  }

  return { data, options }
}
