import React, { useState, useEffect, useRef, useMemo } from 'react'
import { BottomSheet as MuiBottomSheet } from 'mui-bottom-sheet'

import Stack from 'cozy-ui/transpiled/react/Stack'
import Paper from 'cozy-ui/transpiled/react/Paper'

const makeStyles = ({ isTopPosition }) => ({
  root: {
    borderTopLeftRadius: '1rem',
    borderTopRightRadius: '1rem',
    transition: 'border-radius 0.5s',
    boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.5)',
    ...(isTopPosition && {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      boxShadow: '0 0 1px 0 rgba(0, 0, 0, 0.5)'
    })
  },
  indicator: {
    width: '4rem',
    height: '0.25rem',
    borderRadius: '99px',
    backgroundColor: 'var(--secondaryTextColor)'
  },
  stack: {
    backgroundColor: 'var(--defaultBackgroundColor)'
  },
  header: {
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem'
  }
})

export const defaultBottomSheetSpringConfig = {
  tension: 165,
  friction: 17,
  clamp: true
}

// TODO: should be in cozy-ui
const BottomSheet = ({ toolbarNode, header, content }) => {
  const innerContentRef = useRef()
  const headerRef = useRef()
  const headerContentRef = useRef()

  const [isTopPosition, setIsTopPosition] = useState(false)
  const [peekHeights, setPeekHeights] = useState(null)
  const [initPos, setInitPos] = useState(null)
  const [bottomSpacerHeight, setBottomSpacerHeight] = useState(0)

  const styles = useMemo(() => makeStyles({ isTopPosition }), [isTopPosition])

  useEffect(() => {
    const maxHeight = toolbarNode
      ? window.innerHeight - toolbarNode.offsetHeight
      : window.innerHeight - 1

    const mediumHeight = Math.round(maxHeight * 0.33)
    const actionButtonsHeight = parseFloat(
      getComputedStyle(headerContentRef.current).getPropertyValue('height')
    )
    const actionButtonsBottomMargin = parseFloat(
      getComputedStyle(headerContentRef.current).getPropertyValue(
        'padding-bottom'
      )
    )
    const minHeight =
      headerRef.current.offsetHeight +
      actionButtonsHeight +
      actionButtonsBottomMargin

    // Used so that the bottomSheet can be opened to the top,
    // without stopping at the content height
    const bottomSpacerHeight = maxHeight - innerContentRef.current.offsetHeight

    setPeekHeights([minHeight, mediumHeight, maxHeight])
    setInitPos(mediumHeight)
    setBottomSpacerHeight(bottomSpacerHeight)
  }, [innerContentRef, headerContentRef, toolbarNode])

  const handleOnIndexChange = snapIndex => {
    const maxHeightSnapIndex = peekHeights.length - 1

    if (snapIndex === maxHeightSnapIndex && !isTopPosition) {
      setIsTopPosition(true)
    }
    if (snapIndex !== maxHeightSnapIndex && isTopPosition) {
      setIsTopPosition(false)
    }
  }

  return (
    <MuiBottomSheet
      peekHeights={peekHeights}
      defaultHeight={initPos}
      backdrop={false}
      fullHeight={false}
      onIndexChange={snapIndex => handleOnIndexChange(snapIndex)}
      styles={{ root: styles.root }}
      threshold={0}
      // springConfig doc : https://www.react-spring.io/docs/hooks/api
      springConfig={{
        tension: defaultBottomSheetSpringConfig.tension,
        friction: defaultBottomSheetSpringConfig.friction,
        clamp: defaultBottomSheetSpringConfig.clamp
      }}
      disabledClosing={true}
      snapPointSeekerMode="next"
    >
      <div ref={innerContentRef}>
        <div
          data-testid="bottomSheet-header"
          className="u-w-100 u-h-2-half u-pos-relative u-flex u-flex-items-center u-flex-justify-center"
          ref={headerRef}
        >
          <div style={styles.indicator} />
        </div>
        <Stack
          style={styles.stack}
          className="u-flex u-flex-column u-ov-hidden"
          spacing="s"
        >
          <Paper
            ref={headerContentRef}
            style={styles.header}
            className="u-h-3 u-flex u-flex-items-center u-pb-half"
            elevation={0}
            square
          >
            {header}
          </Paper>
          {content}
        </Stack>
      </div>
      <div style={{ height: bottomSpacerHeight }} />
    </MuiBottomSheet>
  )
}

export default React.memo(BottomSheet)
