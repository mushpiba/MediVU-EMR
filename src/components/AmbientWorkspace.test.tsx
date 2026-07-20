import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, vi } from 'vitest'
import { demoScenario } from '../data/demoScenario'
import { AmbientWorkspace } from './AmbientWorkspace'

describe('AmbientWorkspace', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the patient context, initial evidence, and five diagnoses', () => {
    render(<AmbientWorkspace scenario={demoScenario} onSelectDiagnosis={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'MediVU EMR' })).toBeInTheDocument()
    expect(screen.getByText('가상 환자 A-001')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ambient AI/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: '제2형 당뇨병 삭제' })).toBeInTheDocument()
    expect(screen.getAllByTestId('diagnosis-card')).toHaveLength(5)
    expect(screen.queryByRole('button', { name: '누런 가래 동반 기침 삭제' })).not.toBeInTheDocument()
  })

  it('reveals transcript lines and Ambient keywords during playback', () => {
    render(<AmbientWorkspace scenario={demoScenario} onSelectDiagnosis={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: '대화 재생' }))

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.getByText('사흘 전부터 기침이 나고 누런 가래가 계속 나와요.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '누런 가래 동반 기침 삭제' })).toBeInTheDocument()
  })

  it('adds doctor keywords, blocks duplicates, and excludes evidence without deleting its source', async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    render(<AmbientWorkspace scenario={demoScenario} onSelectDiagnosis={vi.fn()} />)

    const input = screen.getByRole('textbox', { name: '의사 키워드 입력' })
    await user.type(input, '7일 후 추적')
    await user.click(screen.getByRole('button', { name: '키워드 추가' }))
    expect(screen.getByRole('button', { name: '7일 후 추적 삭제' })).toBeInTheDocument()

    await user.type(input, '제2형 당뇨병')
    await user.click(screen.getByRole('button', { name: '키워드 추가' }))
    expect(screen.getByRole('status')).toHaveTextContent('이미 등록된 키워드입니다.')

    await user.click(screen.getByRole('button', { name: '제2형 당뇨병 삭제' }))
    expect(screen.queryByRole('button', { name: '제2형 당뇨병 삭제' })).not.toBeInTheDocument()
    expect(screen.getByText('2021.04 제2형 당뇨병 진단')).toBeInTheDocument()
  })

  it('adds a custom memo tag to a diagnosis card', async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    render(<AmbientWorkspace scenario={demoScenario} onSelectDiagnosis={vi.fn()} />)

    const pneumoniaCard = screen.getByTestId('diagnosis-card-cap')
    await user.type(
      within(pneumoniaCard).getByRole('textbox', { name: '지역사회획득폐렴 태그 입력' }),
      '보호자 연락 완료',
    )
    await user.click(
      within(pneumoniaCard).getByRole('button', { name: '지역사회획득폐렴 태그 추가' }),
    )

    expect(within(pneumoniaCard).getByText('보호자 연락 완료')).toBeInTheDocument()
  })
})
