import type { DiagnosisCandidate, Keyword, RankedDiagnosis } from './types'

export function scoreDiagnoses(
  activeKeywords: Keyword[],
  candidates: DiagnosisCandidate[],
): RankedDiagnosis[] {
  return candidates
    .map((candidate) => {
      const matchedKeywordIds = activeKeywords
        .filter((keyword) => candidate.weights[keyword.id] !== undefined)
        .map((keyword) => keyword.id)
      const weightedScore = matchedKeywordIds.reduce(
        (score, keywordId) => score + candidate.weights[keywordId],
        candidate.baseScore,
      )

      return {
        ...candidate,
        score: Math.min(99, Math.max(1, Math.round(weightedScore))),
        matchedKeywordIds,
      }
    })
    .sort((left, right) => right.score - left.score || left.name.localeCompare(right.name, 'ko-KR'))
    .slice(0, 5)
}
