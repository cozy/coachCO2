import { modeToColor, purposeToColor } from 'src/components/helpers'
import { formatCO2 } from 'src/lib/helpers'

export const makeChartProps = (sortedTimeseries, type, t) => {
  const sortedTimeseriesKeys = Object.keys(sortedTimeseries)
  const sortedTimeseriesValues = Object.values(sortedTimeseries)
  const pickColors = type === 'modes' ? modeToColor : purposeToColor

  const timeseriesData = sortedTimeseriesValues.map(val => val.totalCO2)
  const colors = sortedTimeseriesKeys.map(el => pickColors(el))
  const labels = sortedTimeseriesKeys.map(el => t(`trips.${type}.${el}`))

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
    plugins: {
      tooltip: {
        displayColors: false,
        callbacks: {
          label: tooltipItems =>
            `${tooltipItems.label} ${formatCO2(tooltipItems.raw)}`
        }
      }
    }
  }

  return { data, options }
}
