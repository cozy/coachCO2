import { modeToColor, purposeToColor } from 'src/components/helpers'
import { formatCO2 } from 'src/lib/trips'

export const makeChartProps = (sortedTimeseries, type, t) => {
  const timeseriesData = Object.values(sortedTimeseries).map(
    val => val.totalCO2
  )
  const pickColors = type === 'modes' ? modeToColor : purposeToColor
  const colors = Object.keys(sortedTimeseries).map(el => pickColors(el))
  const labels = Object.keys(sortedTimeseries).map(el =>
    t(`trips.${type}.${el}`)
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
