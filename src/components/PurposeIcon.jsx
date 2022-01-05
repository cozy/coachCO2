import React, { useMemo } from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'

import { pickPurposeIcon } from 'src/components/helpers'
import {
  HOME_PURPOSE,
  WORK_PURPOSE,
  SCHOOL_PURPOSE,
  SHOPPING_PURPOSE,
  MEAL_PURPOSE,
  PERSONALMED_PURPOSE,
  EXERCISE_PURPOSE,
  ENTERTAINMENT_PURPOSE,
  PICKDROP_PURPOSE,
  OTHER_PURPOSE
} from 'src/constants/const'

export const purposeToColor = (purpose = OTHER_PURPOSE) => {
  const colors = {
    [HOME_PURPOSE]: '#F1B61E',
    [WORK_PURPOSE]: '#BA5AE8',
    [SCHOOL_PURPOSE]: '#8978FF',
    [SHOPPING_PURPOSE]: '#FF7B5E',
    [MEAL_PURPOSE]: '#15CACD',
    [PERSONALMED_PURPOSE]: '#1CAAE8',
    [EXERCISE_PURPOSE]: '#21B930',
    [ENTERTAINMENT_PURPOSE]: '#F85AA8',
    [PICKDROP_PURPOSE]: '#C78542',
    [OTHER_PURPOSE]: '#A4A7AC'
  }

  return colors[purpose]
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

const PurposeIcon = ({ purpose, faded }) => {
  const color = useMemo(() => purposeToColor(purpose), [purpose])
  const style = useMemo(() => makeStyle({ faded, color }), [color, faded])

  return <Avatar style={style} icon={pickPurposeIcon(purpose)} size={32} />
}

export default React.memo(PurposeIcon)
