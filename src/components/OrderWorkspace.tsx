import { useState } from 'react'
import type {
  DiagnosisCandidate,
  DiagnosisTag,
  Keyword,
  OrderItem,
  OrderTemplate,
  PatientSummary,
} from '../domain/types'
import { PatientHeader } from './PatientHeader'
import { Sidebar } from './Sidebar'
import { sourceMeta } from './KeywordBoard'

const categoryLabels: Record<OrderItem['category'], string> = {
  medication: '처방',
  test: '검사',
  'follow-up': '추적관찰',
}

interface OrderWorkspaceProps {
  patient: PatientSummary
  diagnosis: DiagnosisCandidate
  template: OrderTemplate
  keywords: Keyword[]
  tags: DiagnosisTag[]
  onBack: () => void
  onReset: () => void
}

export function OrderWorkspace({
  patient,
  diagnosis,
  template,
  keywords,
  tags,
  onBack,
  onReset,
}: OrderWorkspaceProps) {
  const [items, setItems] = useState(() => template.items.map((item) => ({ ...item })))
  const [note, setNote] = useState(template.note)
  const [saveNotice, setSaveNotice] = useState('')

  const updateItem = (itemId: string, changes: Partial<OrderItem>) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? { ...item, ...changes } : item)),
    )
    setSaveNotice('')
  }

  const handleReset = () => {
    setItems(template.items.map((item) => ({ ...item })))
    setNote(template.note)
    setSaveNotice('오더 양식을 처음 상태로 복원했습니다.')
  }

  return (
    <div className="app-shell">
      <Sidebar activeItem="orders" onReset={onReset} />
      <div className="clinical-app">
        <PatientHeader patient={patient} />
        <main className="order-workspace">
          <header className="order-titlebar">
            <div>
              <button type="button" className="back-button" onClick={onBack}>
                <span aria-hidden="true">←</span> 진료 화면으로 돌아가기
              </button>
              <span className="eyebrow">SMART ORDER WORKSPACE</span>
              <h2>처방·오더 편집</h2>
              <p>선택한 진단과 임상 근거를 반영한 저장 양식입니다.</p>
            </div>
            <div className="selected-diagnosis" aria-label="선택 진단">
              <span>선택 진단</span>
              <strong>{diagnosis.name}</strong>
              <code>{diagnosis.code}</code>
            </div>
          </header>

          <div className="order-grid">
            <div className="order-main-column">
              <section className="order-card" aria-labelledby="order-set-title">
                <div className="order-card-heading">
                  <div>
                    <span className="eyebrow">SAVED ORDER SET</span>
                    <h3 id="order-set-title">{template.title}</h3>
                  </div>
                  <span className="prefilled-badge">자동 입력 완료</span>
                </div>

                {(Object.keys(categoryLabels) as OrderItem['category'][]).map((category) => {
                  const categoryItems = items.filter((item) => item.category === category)
                  if (!categoryItems.length) {
                    return null
                  }

                  return (
                    <fieldset key={category} className="order-group">
                      <legend>{categoryLabels[category]}</legend>
                      {categoryItems.map((item) => (
                        <div key={item.id} className="order-row">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            aria-label={item.label}
                            onChange={(event) => updateItem(item.id, { selected: event.target.checked })}
                          />
                          <label className="visually-hidden" htmlFor={`${item.id}-label`}>
                            {item.label} 항목명
                          </label>
                          <input
                            id={`${item.id}-label`}
                            className="order-item-input"
                            value={item.label}
                            onChange={(event) => updateItem(item.id, { label: event.target.value })}
                          />
                          <span className={item.selected ? 'order-state is-selected' : 'order-state'}>
                            {item.selected ? '포함' : '제외'}
                          </span>
                        </div>
                      ))}
                    </fieldset>
                  )
                })}
              </section>

              <section className="order-card note-card">
                <label htmlFor="clinical-note">진료 메모</label>
                <textarea
                  id="clinical-note"
                  rows={4}
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value)
                    setSaveNotice('')
                  }}
                />
              </section>

              <div className="order-actions">
                <button className="secondary-action" type="button" onClick={handleReset}>양식 초기화</button>
                <button
                  className="primary-action"
                  type="button"
                  onClick={() => setSaveNotice('브라우저 메모리에 저장했습니다.')}
                >
                  오더 저장
                </button>
              </div>
              <p className="save-notice" role="status">{saveNotice}</p>
            </div>

            <aside className="order-context-column">
              <section className="order-card" aria-label="전달된 임상 키워드">
                <span className="eyebrow">TRANSFERRED EVIDENCE</span>
                <h3>전달된 임상 키워드</h3>
                <div className="transferred-keywords">
                  {keywords.map((keyword) => {
                    const meta = sourceMeta[keyword.source]
                    return (
                      <span key={keyword.id} className={`source-${keyword.source}`}>
                        <i aria-hidden="true">{meta.icon}</i>{keyword.label}
                      </span>
                    )
                  })}
                </div>
              </section>

              <section className="order-card">
                <span className="eyebrow">CUSTOM CONTEXT</span>
                <h3>진단별 저장 태그</h3>
                <div className="transferred-tags">
                  {tags.map((tag) => <span key={tag.id}>{tag.label}</span>)}
                </div>
              </section>

              <div className="clinical-warning">
                <strong>시연용 오더</strong>
                <p>실제 처방 또는 의료적 권고가 아니며 서버로 전송되지 않습니다.</p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
