import { useEffect, useMemo, useState } from 'react'
import { addDoctorKeyword, normalizeKeywordLabel } from '../domain/keywords'
import { scoreDiagnoses } from '../domain/scoring'
import type { DemoScenario, DiagnosisTag, Keyword } from '../domain/types'

function initialTags(scenario: DemoScenario) {
  return Object.fromEntries(
    scenario.diagnoses.map((diagnosis) => [diagnosis.id, diagnosis.tags ?? []]),
  )
}

export function useDemoEncounter(scenario: DemoScenario) {
  const [visibleTranscriptCount, setVisibleTranscriptCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [excludedKeywordIds, setExcludedKeywordIds] = useState<string[]>([])
  const [doctorKeywords, setDoctorKeywords] = useState<Keyword[]>([])
  const [tagsByDiagnosis, setTagsByDiagnosis] = useState<Record<string, DiagnosisTag[]>>(
    () => initialTags(scenario),
  )
  const [keywordNotice, setKeywordNotice] = useState('')

  useEffect(() => {
    if (!isPlaying) {
      return
    }

    const timer = window.setInterval(() => {
      setVisibleTranscriptCount((count) => {
        const nextCount = Math.min(count + 1, scenario.transcript.length)
        if (nextCount >= scenario.transcript.length) {
          setIsPlaying(false)
        }
        return nextCount
      })
    }, 1500)

    return () => window.clearInterval(timer)
  }, [isPlaying, scenario.transcript.length])

  const visibleTranscript = scenario.transcript.slice(0, visibleTranscriptCount)
  const activeKeywords = useMemo(() => {
    const revealedIds = new Set([
      ...scenario.initialKeywordIds,
      ...visibleTranscript.flatMap(({ keywordIds }) => keywordIds),
    ])
    const excludedIds = new Set(excludedKeywordIds)

    return [
      ...scenario.keywords.filter(
        (keyword) => revealedIds.has(keyword.id) && !excludedIds.has(keyword.id),
      ),
      ...doctorKeywords,
    ]
  }, [doctorKeywords, excludedKeywordIds, scenario, visibleTranscript])

  const rankedDiagnoses = useMemo(
    () => scoreDiagnoses(activeKeywords, scenario.diagnoses),
    [activeKeywords, scenario.diagnoses],
  )

  const togglePlayback = () => {
    setKeywordNotice('')
    if (visibleTranscriptCount >= scenario.transcript.length) {
      setVisibleTranscriptCount(0)
      setExcludedKeywordIds([])
      setIsPlaying(true)
      return
    }
    setIsPlaying((playing) => !playing)
  }

  const resetDemo = () => {
    setVisibleTranscriptCount(0)
    setIsPlaying(false)
    setExcludedKeywordIds([])
    setDoctorKeywords([])
    setTagsByDiagnosis(initialTags(scenario))
    setKeywordNotice('데모가 초기 상태로 복원됐습니다.')
  }

  const addKeyword = (label: string) => {
    const nextKeywords = addDoctorKeyword(activeKeywords, label)
    if (nextKeywords === activeKeywords) {
      setKeywordNotice(
        normalizeKeywordLabel(label) ? '이미 등록된 키워드입니다.' : '키워드를 입력해 주세요.',
      )
      return false
    }

    setDoctorKeywords((keywords) => [...keywords, nextKeywords[nextKeywords.length - 1]])
    setKeywordNotice('의사 키워드를 추가했습니다.')
    return true
  }

  const removeKeyword = (keyword: Keyword) => {
    if (keyword.source === 'doctor') {
      setDoctorKeywords((keywords) => keywords.filter(({ id }) => id !== keyword.id))
    } else {
      setExcludedKeywordIds((ids) => [...ids, keyword.id])
    }
    setKeywordNotice(`${keyword.label}을 진단 근거에서 제외했습니다.`)
  }

  const addDiagnosisTag = (diagnosisId: string, label: string) => {
    const displayLabel = label.trim().replace(/\s+/g, ' ')
    if (!displayLabel) {
      return false
    }

    const normalizedLabel = normalizeKeywordLabel(displayLabel)
    const currentTags = tagsByDiagnosis[diagnosisId] ?? []
    if (currentTags.some((tag) => normalizeKeywordLabel(tag.label) === normalizedLabel)) {
      return false
    }

    setTagsByDiagnosis((tags) => ({
      ...tags,
      [diagnosisId]: [
        ...currentTags,
        {
          id: `${diagnosisId}-memo-${normalizedLabel.replace(/\s+/g, '-')}`,
          label: displayLabel,
          kind: 'memo',
        },
      ],
    }))
    return true
  }

  const removeDiagnosisTag = (diagnosisId: string, tagId: string) => {
    setTagsByDiagnosis((tags) => ({
      ...tags,
      [diagnosisId]: (tags[diagnosisId] ?? []).filter(({ id }) => id !== tagId),
    }))
  }

  return {
    activeKeywords,
    addDiagnosisTag,
    addKeyword,
    isPlaying,
    keywordNotice,
    rankedDiagnoses,
    removeDiagnosisTag,
    removeKeyword,
    resetDemo,
    tagsByDiagnosis,
    togglePlayback,
    visibleTranscript,
    visibleTranscriptCount,
  }
}
