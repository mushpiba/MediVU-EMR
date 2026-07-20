import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from './App'

describe('App order flow', () => {
  beforeEach(() => {
    window.location.hash = '#/ambient'
  })

  it('opens a prefilled order workspace for the selected diagnosis', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '지역사회획득폐렴 오더 열기' }))

    expect(window.location.hash).toBe('#/orders/cap')
    expect(screen.getByRole('heading', { name: '처방·오더 편집' })).toBeInTheDocument()
    const selectedDiagnosis = screen.getByLabelText('선택 진단')
    expect(within(selectedDiagnosis).getByText('지역사회획득폐렴')).toBeInTheDocument()
    expect(within(selectedDiagnosis).getByText('J18.9')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'CBC·CRP 추적 검사' })).toBeChecked()
    expect(within(screen.getByLabelText('전달된 임상 키워드')).getByText('제2형 당뇨병')).toBeInTheDocument()
  })

  it('edits order content and confirms an in-memory save', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '지역사회획득폐렴 오더 열기' }))

    await user.click(screen.getByRole('checkbox', { name: 'CBC·CRP 추적 검사' }))
    expect(screen.getByRole('checkbox', { name: 'CBC·CRP 추적 검사' })).not.toBeChecked()

    const itemInput = screen.getByRole('textbox', { name: 'CBC·CRP 추적 검사 항목명' })
    await user.clear(itemInput)
    await user.type(itemInput, 'CBC 추적 검사')

    const note = screen.getByRole('textbox', { name: '진료 메모' })
    await user.clear(note)
    await user.type(note, '가상 추적 메모')
    await user.click(screen.getByRole('button', { name: '오더 저장' }))

    expect(screen.getByRole('status')).toHaveTextContent('브라우저 메모리에 저장했습니다.')
  })

  it('returns to the Ambient workspace without a page reload', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '지역사회획득폐렴 오더 열기' }))
    await user.click(screen.getByRole('button', { name: '진료 화면으로 돌아가기' }))

    expect(window.location.hash).toBe('#/ambient')
    expect(screen.getByRole('heading', { name: '실시간 진료 대화' })).toBeInTheDocument()
  })
})
