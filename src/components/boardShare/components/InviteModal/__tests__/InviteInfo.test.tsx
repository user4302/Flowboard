import React from 'react'
import { render } from '@testing-library/react'
import { InviteInfo } from '../InviteInfo'

describe('InviteInfo', () => {
  it('should render without crashing', () => {
    expect(() => render(<InviteInfo />)).not.toThrow()
  })

  it('should handle default props', () => {
    expect(() => render(<InviteInfo />)).not.toThrow()
  })
})
