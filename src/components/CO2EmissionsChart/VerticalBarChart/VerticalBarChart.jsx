import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from 'chart.js'
import React from 'react'
import { Bar } from 'react-chartjs-2'

import Typography from 'cozy-ui/transpiled/react/Typography'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)
ChartJS.defaults.font = {
  family: 'Lato, sans-serif',
  size: '11',
  weight: '700'
}

const VerticalBarChart = ({
  className,
  title,
  data,
  options,
  width,
  height,
  children
}) => {
  return (
    <>
      <Typography className="u-mt-1 u-ml-1" variant="h5">
        {title}
      </Typography>
      <div style={{ width, height }}>
        <Bar
          className={className}
          width={width}
          height={height}
          options={options}
          data={data}
        />
      </div>
      {children}
    </>
  )
}

export default VerticalBarChart
