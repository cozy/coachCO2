import React, { useCallback } from 'react'

import { isQueryLoading, useQuery } from 'cozy-client'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { buildTimeserieQueryById } from 'src/queries/queries'
import { getEndPlaceDisplayName } from 'src/lib/timeseries'
import TripMap from 'src/components/Trip/TripMap'
import BottomSheetHeaderContent from 'src/components/Trip/BottomSheet/BottomSheetHeaderContent'
import BottomSheetContent from 'src/components/Trip/BottomSheet/BottomSheetContent'
import TripProvider from 'src/components/Providers/TripProvider'

const styles = {
  map: {
    height: '400px',
    margin: '-24px -32px 0'
  },
  divider: {
    margin: '10px -32px 25px'
  }
}

const TripDialogDesktop = ({ timeserieId, setShowTripDialog }) => {
  const timeserieQuery = buildTimeserieQueryById(timeserieId)
  const { data: timeserie, ...timeseriesQueryResult } = useQuery(
    timeserieQuery.definition,
    timeserieQuery.options
  )

  const isLoading = isQueryLoading(timeseriesQueryResult)

  const hideModal = useCallback(
    () => setShowTripDialog(false),
    [setShowTripDialog]
  )

  return (
    <TripProvider timeserie={isLoading ? '' : timeserie}>
      <Dialog
        open={true}
        onClose={hideModal}
        title={isLoading ? '' : getEndPlaceDisplayName(timeserie)}
        size="large"
        content={
          isLoading ? (
            <Spinner
              size="xxlarge"
              className="u-flex u-flex-justify-center u-mt-1"
            />
          ) : (
            <>
              <div style={styles.map}>
                <TripMap />
              </div>
              <div className="u-mt-1 u-h-3 u-flex u-flex-items-center u-pb-half">
                <BottomSheetHeaderContent />
              </div>
              <Divider style={styles.divider} />
              <BottomSheetContent />
            </>
          )
        }
      />
    </TripProvider>
  )
}

export default React.memo(TripDialogDesktop)
