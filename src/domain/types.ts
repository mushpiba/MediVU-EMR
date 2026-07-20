export type KeywordSource = 'ambient' | 'history' | 'lab' | 'imaging' | 'doctor'

export interface Keyword {
  id: string
  label: string
  source: KeywordSource
  detail?: string
}

export interface PatientSummary {
  id: string
  label: string
  age: number
  sex: string
  visitReason: string
  allergies: string[]
  history: string[]
}

export interface TranscriptEvent {
  id: string
  speaker: 'doctor' | 'patient'
  text: string
  keywordIds: string[]
}

export interface DiagnosisTag {
  id: string
  label: string
  kind: 'code' | 'protocol' | 'memo' | 'order-set'
}

export interface DiagnosisCandidate {
  id: string
  name: string
  code: string
  baseScore: number
  weights: Record<string, number>
  tags?: DiagnosisTag[]
}

export interface RankedDiagnosis extends DiagnosisCandidate {
  score: number
  matchedKeywordIds: string[]
}

export interface OrderItem {
  id: string
  label: string
  category: 'medication' | 'test' | 'follow-up'
  selected: boolean
}

export interface OrderTemplate {
  diagnosisId: string
  title: string
  items: OrderItem[]
  note: string
}

export interface EvidenceGroup {
  id: string
  source: Exclude<KeywordSource, 'ambient' | 'doctor'>
  title: string
  entries: string[]
}

export interface DemoScenario {
  patient: PatientSummary
  keywords: Keyword[]
  initialKeywordIds: string[]
  transcript: TranscriptEvent[]
  diagnoses: DiagnosisCandidate[]
  evidence: EvidenceGroup[]
  orderTemplates: OrderTemplate[]
}
