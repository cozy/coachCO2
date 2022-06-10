import { computeMonthsAndCO2s } from 'src/lib/timeseries'

export const makeData = ({
  theme,
  oneYearOldTimeseries,
  // allowSendDataToDacc,
  f
}) => {
  const { months, CO2s } = computeMonthsAndCO2s(oneYearOldTimeseries, f)

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Dataset 1',
        backgroundColor: theme.palette.primary.main,
        borderRadius: 8,
        barThickness: 8,
        data: CO2s
      }
    ]
  }

  // TODO: to be refactored when DACC is finished
  // if (allowSendDataToDacc) {
  //   data.datasets.push({
  //     label: 'Dataset 1',
  //     backgroundColor: theme.palette.border.main,
  //     borderRadius: 8,
  //     barThickness: 8,
  //     data: [0, 1800, 1700, 3600, 1900, 2800, 4000, 1300, 2800, 2700, 660, 2000]
  //   })
  // }

  return data
}

export const makeOptions = theme => ({
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: theme.palette.text.secondary,
        // don't use arrow func here to keep reference to `this`
        callback: function (value, index) {
          return index % 2 !== 0 ? this.getLabelForValue(value) : ''
        }
      }
    },
    y: {
      grid: {
        color: theme.palette.border.main,
        drawBorder: false
      },
      ticks: {
        color: theme.palette.text.secondary,
        // don't use arrow func here to keep reference to `this`
        callback: function (value) {
          return `${value} g`
        }
      }
    }
  }
})
