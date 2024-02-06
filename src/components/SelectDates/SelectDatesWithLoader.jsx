import React from 'react'
import SelectDates from 'src/components/SelectDates/SelectDates'

import Box from 'cozy-ui/transpiled/react/Box'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import LeftIcon from 'cozy-ui/transpiled/react/Icons/Left'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'

const SelectDatesWithLoader = ({
  className,
  options,
  isLoading,
  isFullYear,
  setIsFullYear,
  selectedDate,
  setSelectedDate
}) => {
  if (isLoading) {
    return (
      <Box
        display="flex"
        className="u-mt-1-s u-ml-0-s u-flex-justify-center-s u-flex u-ml-2"
      >
        <Box
          display="inline-flex"
          width={264}
          borderRadius={999}
          style={{ backgroundColor: 'var(--actionColorDisabledBackground)' }}
        />
        <Box className="u-ml-half" display="inline-flex">
          <IconButton
            style={{ backgroundColor: 'var(--actionColorDisabledBackground)' }}
            size="medium"
            disabled={true}
          >
            <Icon icon={LeftIcon} />
          </IconButton>
          <IconButton
            style={{ backgroundColor: 'var(--actionColorDisabledBackground)' }}
            className="u-ml-half"
            size="medium"
            disabled={true}
          >
            <Icon icon={RightIcon} />
          </IconButton>
        </Box>
      </Box>
    )
  }

  return (
    <SelectDates
      className={className}
      options={options}
      isFullYear={isFullYear}
      setIsFullYear={setIsFullYear}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  )
}

export default SelectDatesWithLoader
