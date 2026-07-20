import { render, screen } from '@testing-library/react'
import { App } from './App'

describe('App', () => {
  it('shows the MediVU EMR product heading', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'MediVU EMR' })).toBeInTheDocument()
  })
})
