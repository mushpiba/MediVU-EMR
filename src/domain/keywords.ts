import type { Keyword } from './types'

export function normalizeKeywordLabel(label: string): string {
  return label.trim().replace(/\s+/g, ' ').toLocaleLowerCase('ko-KR')
}

export function addDoctorKeyword(keywords: Keyword[], label: string): Keyword[] {
  const normalizedLabel = normalizeKeywordLabel(label)

  if (!normalizedLabel) {
    return keywords
  }

  const isDuplicate = keywords.some(
    (keyword) => normalizeKeywordLabel(keyword.label) === normalizedLabel,
  )

  if (isDuplicate) {
    return keywords
  }

  const displayLabel = label.trim().replace(/\s+/g, ' ')

  return [
    ...keywords,
    {
      id: `doctor-${normalizedLabel.replace(/\s+/g, '-')}`,
      label: displayLabel,
      source: 'doctor',
    },
  ]
}
