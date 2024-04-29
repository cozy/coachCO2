import { ADDRESS_CATEGORY_TO_LABEL } from 'src/constants'

export const isCustomLabel = (label, t) =>
  ![t('contactToPlace.work'), t('contactToPlace.home'), undefined].includes(
    label
  )

export const makeCustomLabel = ({ label, category, t }) => {
  const type = ADDRESS_CATEGORY_TO_LABEL[category]

  const firstString = isCustomLabel(label, t)
    ? label
    : t('contactToPlace.custom')
  const secondString = isCustomLabel(label, t)
    ? ` (${t(`contactToPlace.${type}`)})`.toLowerCase()
    : ''

  return firstString + secondString
}
