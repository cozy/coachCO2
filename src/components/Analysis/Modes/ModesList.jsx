import React from 'react'
import { useOutletContext } from 'react-router-dom'
import LoadedModesList from 'src/components/Analysis/Modes/LoadedModesList'

const ModesList = () => {
  const [timeseries] = useOutletContext()
  return <LoadedModesList timeseries={timeseries} />
}

export default ModesList
