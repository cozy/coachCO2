'use strict'
import React from 'react'
import { render } from '@testing-library/react'

import Sidebar from 'src/components/Sidebar'
import AppLike from 'test/AppLike'

const setup = () =>
  render(
    <AppLike>
      <Sidebar />
    </AppLike>
  )

describe('Sidebar component', () => {
  it('should be rendered correctly', () => {
    const { container, getByText } = setup()

    expect(container).toBeDefined()
    expect(getByText('Trips'))
    expect(getByText('Settings'))
  })
})
