import { addDoctorKeyword, normalizeKeywordLabel } from './keywords'
import type { Keyword } from './types'

const ambientKeyword: Keyword = {
  id: 'ambient-fever',
  label: '38.2℃ 발열',
  source: 'ambient',
}

describe('keyword helpers', () => {
  it('normalizes whitespace and letter case for comparison', () => {
    expect(normalizeKeywordLabel('  Follow   UP ')).toBe('follow up')
  })

  it('ignores blank doctor input', () => {
    const keywords = [ambientKeyword]

    expect(addDoctorKeyword(keywords, '   ')).toBe(keywords)
  })

  it('does not add a duplicate label', () => {
    const keywords = [ambientKeyword]

    expect(addDoctorKeyword(keywords, '  38.2℃   발열 ')).toBe(keywords)
  })

  it('adds a trimmed doctor keyword', () => {
    const result = addDoctorKeyword([ambientKeyword], '  7일 후   추적 ')

    expect(result).toHaveLength(2)
    expect(result[1]).toMatchObject({
      label: '7일 후 추적',
      source: 'doctor',
    })
  })
})
