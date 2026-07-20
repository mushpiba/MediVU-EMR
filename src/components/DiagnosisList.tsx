import { useState, type FormEvent } from 'react'
import type { DiagnosisTag, Keyword, RankedDiagnosis } from '../domain/types'

interface DiagnosisCardProps {
  diagnosis: RankedDiagnosis
  keywords: Keyword[]
  rank: number
  tags: DiagnosisTag[]
  onAddTag: (diagnosisId: string, label: string) => boolean
  onRemoveTag: (diagnosisId: string, tagId: string) => void
  onSelect: (diagnosisId: string) => void
}

function DiagnosisCard({
  diagnosis,
  keywords,
  rank,
  tags,
  onAddTag,
  onRemoveTag,
  onSelect,
}: DiagnosisCardProps) {
  const [tagInput, setTagInput] = useState('')
  const evidenceLabels = diagnosis.matchedKeywordIds
    .map((keywordId) => keywords.find(({ id }) => id === keywordId)?.label)
    .filter(Boolean)
    .slice(0, 4)

  const handleTagSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (onAddTag(diagnosis.id, tagInput)) {
      setTagInput('')
    }
  }

  return (
    <article className={`diagnosis-card ${rank === 1 ? 'is-leading' : ''}`} data-testid="diagnosis-card">
      <div data-testid={`diagnosis-card-${diagnosis.id}`}>
        <div className="diagnosis-main-row">
          <span className="diagnosis-rank">{rank}</span>
          <button
            className="diagnosis-select"
            type="button"
            aria-label={`${diagnosis.name} 오더 열기`}
            onClick={() => onSelect(diagnosis.id)}
          >
            <span>
              <strong>{diagnosis.name}</strong>
              <small>{diagnosis.code}</small>
            </span>
            <span className="probability">
              <strong>{diagnosis.score}%</strong>
              <small>AI 추정 확률</small>
            </span>
            <span className="open-order" aria-hidden="true">→</span>
          </button>
        </div>

        <div className="evidence-preview" aria-label={`${diagnosis.name} 주요 근거`}>
          {evidenceLabels.map((label) => <span key={label}>{label}</span>)}
        </div>

        <div className="diagnosis-tags">
          {tags.map((tag) => (
            <span key={tag.id} className={`diagnosis-tag tag-${tag.kind}`}>
              {tag.label}
              <button
                type="button"
                aria-label={`${diagnosis.name} 태그 ${tag.label} 삭제`}
                onClick={() => onRemoveTag(diagnosis.id, tag.id)}
              >×</button>
            </span>
          ))}
        </div>

        <form className="diagnosis-tag-form" onSubmit={handleTagSubmit}>
          <label className="visually-hidden" htmlFor={`${diagnosis.id}-tag-input`}>
            {diagnosis.name} 태그 입력
          </label>
          <input
            id={`${diagnosis.id}-tag-input`}
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            placeholder="메모 또는 태그 추가"
          />
          <button type="submit" aria-label={`${diagnosis.name} 태그 추가`}>＋</button>
        </form>
      </div>
    </article>
  )
}

interface DiagnosisListProps {
  diagnoses: RankedDiagnosis[]
  keywords: Keyword[]
  tagsByDiagnosis: Record<string, DiagnosisTag[]>
  onAddTag: (diagnosisId: string, label: string) => boolean
  onRemoveTag: (diagnosisId: string, tagId: string) => void
  onSelect: (diagnosisId: string) => void
}

export function DiagnosisList(props: DiagnosisListProps) {
  return (
    <section className="diagnosis-section" aria-labelledby="diagnosis-title">
      <div className="diagnosis-heading">
        <div>
          <span className="eyebrow">DIFFERENTIAL SUPPORT</span>
          <h2 id="diagnosis-title">진단 후보 Top 5</h2>
        </div>
        <span className="demo-disclaimer">데모 데이터 · 최종 판단은 의료진</span>
      </div>
      <div className="diagnosis-list">
        {props.diagnoses.map((diagnosis, index) => (
          <DiagnosisCard
            key={diagnosis.id}
            diagnosis={diagnosis}
            keywords={props.keywords}
            rank={index + 1}
            tags={props.tagsByDiagnosis[diagnosis.id] ?? []}
            onAddTag={props.onAddTag}
            onRemoveTag={props.onRemoveTag}
            onSelect={props.onSelect}
          />
        ))}
      </div>
      <p className="probability-note">후보별 독립 추정치로, 표시값의 합계는 100%가 아닐 수 있습니다.</p>
    </section>
  )
}
