import { useState, type FormEvent } from 'react'
import type { Keyword, KeywordSource } from '../domain/types'

const sourceMeta: Record<KeywordSource, { icon: string; label: string }> = {
  ambient: { icon: '✦', label: '대화 AI' },
  history: { icon: '↺', label: '과거기록' },
  lab: { icon: '∿', label: '검사' },
  imaging: { icon: '◫', label: '영상' },
  doctor: { icon: '✎', label: '의사 입력' },
}

interface KeywordChipProps {
  keyword: Keyword
  onRemove: (keyword: Keyword) => void
}

function KeywordChip({ keyword, onRemove }: KeywordChipProps) {
  const meta = sourceMeta[keyword.source]

  return (
    <span className={`keyword-chip source-${keyword.source}`}>
      <span className="keyword-source-icon" aria-hidden="true">{meta.icon}</span>
      <span>{keyword.label}</span>
      <span className="visually-hidden"> · {meta.label}</span>
      <button type="button" onClick={() => onRemove(keyword)} aria-label={`${keyword.label} 삭제`}>
        ×
      </button>
    </span>
  )
}

interface KeywordBoardProps {
  keywords: Keyword[]
  notice: string
  onAdd: (label: string) => boolean
  onRemove: (keyword: Keyword) => void
}

export function KeywordBoard({ keywords, notice, onAdd, onRemove }: KeywordBoardProps) {
  const [input, setInput] = useState('')
  const aiKeywords = keywords.filter(({ source }) => source !== 'doctor')
  const doctorKeywords = keywords.filter(({ source }) => source === 'doctor')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (onAdd(input)) {
      setInput('')
    }
  }

  return (
    <section className="keyword-board" aria-labelledby="keyword-title">
      <div className="keyword-title-row">
        <div>
          <span className="eyebrow">LIVE EVIDENCE</span>
          <h2 id="keyword-title">임상 키워드</h2>
        </div>
        <div className="source-legend" aria-label="키워드 출처 범례">
          {Object.entries(sourceMeta).map(([source, meta]) => (
            <span key={source}><i className={`legend-dot source-${source}`} />{meta.label}</span>
          ))}
        </div>
      </div>

      <div className="keyword-lane ai-keywords">
        <div className="lane-label"><span aria-hidden="true">✦</span> AI·기존기록 근거</div>
        <div className="keyword-list">
          {aiKeywords.map((keyword) => (
            <KeywordChip key={keyword.id} keyword={keyword} onRemove={onRemove} />
          ))}
        </div>
      </div>

      <div className="keyword-lane doctor-keywords">
        <div className="lane-label"><span aria-hidden="true">✎</span> 의사 직접 입력</div>
        <div className="keyword-list">
          {doctorKeywords.map((keyword) => (
            <KeywordChip key={keyword.id} keyword={keyword} onRemove={onRemove} />
          ))}
        </div>
        <form className="keyword-form" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="doctor-keyword">의사 키워드 입력</label>
          <input
            id="doctor-keyword"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="메모, 진료 지침 또는 추가 근거 입력"
          />
          <button type="submit">키워드 추가</button>
        </form>
      </div>
      <p className="keyword-notice" role="status">{notice}</p>
    </section>
  )
}

export { sourceMeta }
