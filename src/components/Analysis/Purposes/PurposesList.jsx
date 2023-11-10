import React from 'react'
import { useOutletContext } from 'react-router-dom'
import LoadedPurposesList from 'src/components/Analysis/Purposes/LoadedPurposesList'

const PurposesList = () => {
  const [timeseries] = useOutletContext()

  return <LoadedPurposesList timeseries={timeseries} />
}

export default PurposesList
