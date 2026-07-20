import { scoreDiagnoses } from '../domain/scoring'
import { demoScenario } from './demoScenario'

describe('demoScenario', () => {
  it('contains a complete fabricated outpatient case', () => {
    expect(demoScenario.patient.label).toBe('가상 환자 A-001')
    expect(demoScenario.diagnoses).toHaveLength(5)
    expect(demoScenario.transcript.length).toBeGreaterThanOrEqual(8)
    expect(demoScenario.orderTemplates.some(({ diagnosisId }) => diagnosisId === 'cap')).toBe(true)
  })

  it('only references keywords that exist in the scenario', () => {
    const keywordIds = new Set(demoScenario.keywords.map(({ id }) => id))
    const referencedIds = [
      ...demoScenario.initialKeywordIds,
      ...demoScenario.transcript.flatMap(({ keywordIds: eventKeywordIds }) => eventKeywordIds),
    ]

    expect(referencedIds.every((keywordId) => keywordIds.has(keywordId))).toBe(true)
  })

  it('ranks community-acquired pneumonia first after the full conversation', () => {
    const allActiveKeywordIds = new Set([
      ...demoScenario.initialKeywordIds,
      ...demoScenario.transcript.flatMap(({ keywordIds }) => keywordIds),
    ])
    const activeKeywords = demoScenario.keywords.filter(({ id }) => allActiveKeywordIds.has(id))

    expect(scoreDiagnoses(activeKeywords, demoScenario.diagnoses)[0].id).toBe('cap')
  })
})
