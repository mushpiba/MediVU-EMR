import type { EvidenceGroup } from '../domain/types'
import { sourceMeta } from './KeywordBoard'

interface EvidencePanelProps {
  evidence: EvidenceGroup[]
  isOpen: boolean
  onClose: () => void
}

export function EvidencePanel({ evidence, isOpen, onClose }: EvidencePanelProps) {
  return (
    <aside className={`panel evidence-panel ${isOpen ? 'is-open' : ''}`} aria-labelledby="evidence-title">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">PATIENT CONTEXT</span>
          <h2 id="evidence-title">기존 임상 근거</h2>
        </div>
        <button className="evidence-close" type="button" onClick={onClose} aria-label="근거 패널 닫기">×</button>
      </div>
      <p className="evidence-intro">원자료는 유지되며, 키워드 삭제 시 진단 계산에서만 제외됩니다.</p>
      <div className="evidence-groups">
        {evidence.map((group) => {
          const meta = sourceMeta[group.source]
          return (
            <section key={group.id} className={`evidence-group source-${group.source}`}>
              <div className="evidence-group-title">
                <span aria-hidden="true">{meta.icon}</span>
                <div><strong>{group.title}</strong><small>{meta.label}</small></div>
              </div>
              <ul>
                {group.entries.map((entry) => <li key={entry}>{entry}</li>)}
              </ul>
            </section>
          )
        })}
      </div>
      <div className="audit-card">
        <span aria-hidden="true">✓</span>
        <div><strong>근거 추적 가능</strong><p>각 키워드의 원본 출처를 확인할 수 있습니다.</p></div>
      </div>
    </aside>
  )
}
