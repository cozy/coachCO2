import { computeMonthsAndCO2s } from 'src/lib/timeseries'

export const makeData = ({
  theme,
  oneYearOldTimeseries,
  allowSendDataToDacc,
  globalAverages,
  f,
  t
}) => {
  const { months, CO2s } = computeMonthsAndCO2s(oneYearOldTimeseries, f)

  const data = {
    labels: months,
    datasets: [
      {
        label: t('vericalBarChart.legend.yours'),
        backgroundColor: theme.palette.primary.main,
        borderRadius: 8,
        barThickness: 8,
        data: CO2s
      }
    ]
  }

  if (allowSendDataToDacc) {
    data.datasets.push({
      label: t('vericalBarChart.legend.average'),
      backgroundColor: theme.palette.border.main,
      borderRadius: 8,
      barThickness: 8,
      data: globalAverages
    })
  }

  return data
}

export const makeOptions = theme => ({
  maintainAspectRatio: false,
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
          return `${value} kg`
        }
      }
    }
  },
  plugins: {
    tooltip: {
      displayColors: false
    }
  }
})
