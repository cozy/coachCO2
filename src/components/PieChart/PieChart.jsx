import React from 'react'

import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

import Typography from 'cozy-ui/transpiled/react/Typography'
import Box from 'cozy-ui/transpiled/react/Box'

ChartJS.register(ArcElement, Tooltip)

const styles = {
  container: {
    position: 'relative',
    zIndex: '1',
    width: '192px',
    height: '192px'
  },
  background: {
    position: 'absolute',
    boxSizing: 'border-box',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    border: '24px solid var(--actionColorGhost)',
    borderRadius: '100%',
    zIndex: -1
  },
  centerText: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    alignItems: 'center',
    top: '25px',
    left: '25px',
    right: '25px',
    bottom: '25px',
    justifyContent: 'center',
    borderRadius: '50%',
    zIndex: '-1'
  }
}

// TODO: should be in cozy-ui
const PieChart = ({ data, options, total, label }) => {
  return (
    <Box {...styles.container}>
      <Box {...styles.background} />
      <Doughnut data={data} options={options} width={192} height={192} />
      <Box {...styles.centerText}>
        <Typography variant="h3">{total}</Typography>
        <Typography variant="body2">{label}</Typography>
      </Box>
    </Box>
  )
}

export default PieChart
