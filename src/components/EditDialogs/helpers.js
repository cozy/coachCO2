import { ModeAvatar } from 'src/components/Avatar'
import { modeToCO2PerKm } from 'src/components/helpers'
import {
  AIR_MODE,
  BICYCLING_CATEGORY,
  BICYCLING_MODE,
  BUS_MODE,
  CAR_CATEGORY,
  CAR_MODE,
  MOTO_CATEGORY,
  PUBLIC_TRANSPORT_CATEGORY,
  RECURRING_PURPOSES_SERVICE_NAME,
  MOPED_MODE,
  UNKNOWN_MODE,
  WALKING_MODE
} from 'src/constants'
import { startService } from 'src/lib/services'
import { setAutomaticPurpose, setManualPurpose } from 'src/lib/timeseries'

const saveTripWithPurpose = async ({
  client,
  timeserie,
  purpose,
  isRecurringTrip
} = {}) => {
  let newTimeserie = { ...timeserie }
  if (isRecurringTrip) {
    newTimeserie = setAutomaticPurpose(newTimeserie, purpose, {
      isRecurringTrip
    })
  }
  newTimeserie = setManualPurpose(newTimeserie, purpose, {
    isRecurringTrip
  })
  await client.save(newTimeserie)
}

export const handleOccasionalTrip = async ({ client, timeserie, purpose }) => {
  await saveTripWithPurpose({
    client,
    timeserie,
    purpose,
    isRecurringTrip: false
  })
}

export const handleRecurringTrip = async ({
  client,
  timeserie,
  purpose,
  oldPurpose
} = {}) => {
  await saveTripWithPurpose({
    client,
    timeserie,
    purpose,
    isRecurringTrip: true
  })

  // Start service to set the purpose to similar trips
  startService(client, RECURRING_PURPOSES_SERVICE_NAME, {
    fields: {
      docId: timeserie._id,
      oldPurpose: oldPurpose
    }
  })
}

/**
 * @typedef {object} OptionNestedSelect - The option for the NestedSelect modal component
 * @property {object} id - The ID of the option
 * @property {string} title - The title of the option
 * @property {string} icon - The icon of option
 * @property {boolean} [description] - The description of option
 * @property {boolean} [info] - The information of option
 * @param {object} [opts.action] - The action of option
 * @param {string} opts.action.Component - The action Component
 * @param {Function} opts.action.props - The action props (onClick, etc.)
 * @property {OptionNestedSelect[]} [children] - The children options
 */

/**
 * Create an option for the NestedSelect modal component.
 *
 * @param {object} t - The translation function
 * @param {string} mode - The mode to create the option for
 * @param {object} [opts] - The options
 * @param {boolean} [opts.withDescription] - Whether to display the description
 * @param {boolean} [opts.withInfo] - Whether to display the info
 * @param {object} [opts.action] - The action of option
 * @param {string} opts.action.Component - The action Component
 * @param {object} opts.action.props - The action props (onClick, etc.)
 * @param {string} [opts.icon] - The icon to display
 * @param {OptionNestedSelect[]} [opts.children] - The children options
 * @returns {OptionNestedSelect} The option
 */
const makeOption = (t, mode, opts = {}) => {
  const {
    icon,
    withDescription,
    withInfo,
    action,
    children,
    defaultModes = {}
  } = opts

  const defaultMode = Object.values(defaultModes).some(
    defaultMode => defaultMode === mode
  )

  const title = defaultMode
    ? `${t(`trips.modes.${mode}`)} (${t('trips.modes.default')})`
    : t(`trips.modes.${mode}`)

  return {
    id: mode,
    title,
    isChecked: false,
    icon: ModeAvatar({ attribute: icon || mode }),
    ...(withDescription && {
      description: `${modeToCO2PerKm(mode)} g/km`
    }),
    ...(withInfo && { info: `${modeToCO2PerKm(mode)} g/km` }),
    ...(action && { action }),
    ...(children && { children })
  }
}

/**
 * Create the options list for the NestedSelect modal component.
 *
 * @param {object} t - The translation function
 * @param {object} [opts] - The options
 * @param {string} [opts.defaultModes] - The default mode
 * @param {object} [opts.action] - The action of option
 * @param {string} opts.action.Component - The action Component
 * @param {object} opts.action.props - The action props (onClick, etc.)
 * @returns {{ children: OptionNestedSelect[] }} The options list
 */
export const makeOptions = (t, { defaultModes, action } = {}) => {
  return {
    children: [
      makeOption(t, WALKING_MODE, { withInfo: true }),
      makeOption(t, `categories.${BICYCLING_CATEGORY.name}`, {
        icon: BICYCLING_MODE,
        children: BICYCLING_CATEGORY.modes.map(mode =>
          makeOption(t, mode, {
            withDescription: true,
            action,
            defaultModes
          })
        )
      }),
      makeOption(t, `categories.${MOTO_CATEGORY.name}`, {
        icon: MOPED_MODE,
        children: MOTO_CATEGORY.modes.map(mode =>
          makeOption(t, mode, {
            withDescription: true,
            action,
            defaultModes
          })
        )
      }),
      makeOption(t, `categories.${CAR_CATEGORY.name}`, {
        icon: CAR_MODE,
        children: CAR_CATEGORY.modes.map(mode =>
          makeOption(t, mode, {
            withDescription: true,
            action,
            defaultModes
          })
        )
      }),
      makeOption(t, `categories.${PUBLIC_TRANSPORT_CATEGORY.name}`, {
        icon: BUS_MODE,
        children: PUBLIC_TRANSPORT_CATEGORY.modes.map(mode =>
          makeOption(t, mode, {
            withDescription: true,
            action,
            defaultModes
          })
        )
      }),
      makeOption(t, AIR_MODE, { withInfo: true }),
      makeOption(t, UNKNOWN_MODE)
    ]
  }
}
