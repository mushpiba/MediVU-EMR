import { scoreDiagnoses } from './scoring'
import type { DiagnosisCandidate, Keyword } from './types'

const activeKeywords: Keyword[] = [
  { id: 'fever', label: '발열', source: 'ambient' },
  { id: 'opacity', label: '우하엽 침윤', source: 'imaging' },
]

const candidates: DiagnosisCandidate[] = [
  { id: 'one', name: '진단 1', code: 'A01', baseScore: 20, weights: { fever: 20 } },
  { id: 'two', name: '진단 2', code: 'A02', baseScore: 40, weights: { opacity: 40 } },
  { id: 'three', name: '진단 3', code: 'A03', baseScore: 30, weights: {} },
  { id: 'four', name: '진단 4', code: 'A04', baseScore: 25, weights: {} },
  { id: 'five', name: '진단 5', code: 'A05', baseScore: 15, weights: {} },
  { id: 'six', name: '진단 6', code: 'A06', baseScore: 10, weights: {} },
]

describe('scoreDiagnoses', () => {
  it('adds active keyword weights and sorts the top five descending', () => {
    const result = scoreDiagnoses(activeKeywords, candidates)

    expect(result).toHaveLength(5)
    expect(result.map((diagnosis) => diagnosis.id)).toEqual([
      'two',
      'one',
      'three',
      'four',
      'five',
    ])
    expect(result[0]).toMatchObject({ score: 80, matchedKeywordIds: ['opacity'] })
  })

  it('clamps every score between 1 and 99', () => {
    const extremeCandidates: DiagnosisCandidate[] = [
      { id: 'high', name: '높음', code: 'H', baseScore: 95, weights: { fever: 20 } },
      { id: 'low', name: '낮음', code: 'L', baseScore: 2, weights: { fever: -20 } },
    ]

    expect(scoreDiagnoses(activeKeywords, extremeCandidates).map(({ score }) => score)).toEqual([99, 1])
  })

  it('keeps unknown doctor keywords without changing scores', () => {
    const unknownKeyword: Keyword = {
      id: 'doctor-follow-up',
      label: '7일 후 추적',
      source: 'doctor',
    }

    const before = scoreDiagnoses(activeKeywords, candidates)
    const after = scoreDiagnoses([...activeKeywords, unknownKeyword], candidates)

    expect(after).toEqual(before)
  })
})
