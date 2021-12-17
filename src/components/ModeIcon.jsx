import React, { useMemo } from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'

import { pickModeIcon } from 'src/components/helpers'
import {
  AIR_MODE,
  BICYCLING_MODE,
  BUS_MODE,
  CAR_MODE,
  SUBWAY_MODE,
  TRAIN_MODE,
  WALKING_MODE,
  UNKNOWN_MODE
} from 'src/constants/const'

export const modeToColor = (mode = UNKNOWN_MODE) => {
  const colors = {
    [AIR_MODE]: '#F05759',
    [BICYCLING_MODE]: '#15CACD',
    [BUS_MODE]: '#BA5AE8',
    [CAR_MODE]: '#FF7B5E',
    [SUBWAY_MODE]: '#8978FF',
    [TRAIN_MODE]: '#F1B61E',
    [WALKING_MODE]: '#21B930',
    [UNKNOWN_MODE]: '#A4A7AC'
  }

  return colors[mode]
}

const makeStyle = ({ faded, color }) => {
  return faded
    ? {
        color: 'var(--primaryColor)',
        backgroundColor: 'var(--paperBackgroundColor)',
        border: '1px solid var(--borderMainColor)'
      }
    : { backgroundColor: color }
}

const ModeIcon = ({ mode, faded }) => {
  const color = useMemo(() => modeToColor(mode), [mode])
  const style = useMemo(() => makeStyle({ faded, color }), [color, faded])

  return <Avatar style={style} icon={pickModeIcon(mode)} size={32} />
}

export default React.memo(ModeIcon)
