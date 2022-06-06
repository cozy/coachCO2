import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

import Typography from 'cozy-ui/transpiled/react/Typography'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)
ChartJS.defaults.font = {
  family: 'Lato, sans-serif',
  size: '11',
  weight: '700'
}

const VerticalBarChart = ({ title, data, options, children }) => {
  return (
    <>
      <Typography className="u-mt-1 u-ml-1" variant="h5">
        {title}
      </Typography>
      <Bar
        className="u-mt-1 u-mb-half u-ph-half"
        options={options}
        data={data}
      />
      {children}
    </>
  )
}

export default VerticalBarChart
