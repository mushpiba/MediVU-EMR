import type { PatientSummary } from '../domain/types'

interface PatientHeaderProps {
  patient: PatientSummary
  onOpenEvidence: () => void
}

export function PatientHeader({ patient, onOpenEvidence }: PatientHeaderProps) {
  return (
    <header className="patient-header">
      <div className="patient-primary">
        <span className="demo-badge">DEMO PATIENT</span>
        <strong>{patient.label}</strong>
        <span>{patient.age}세 · {patient.sex}</span>
        <span className="patient-id">ID {patient.id}</span>
      </div>
      <div className="patient-facts" aria-label="환자 요약">
        <span><small>방문 사유</small>{patient.visitReason}</span>
        <span><small>과거력</small>{patient.history.join(' · ')}</span>
        <span><small>알레르기</small>{patient.allergies.join(' · ')}</span>
      </div>
      <button className="evidence-toggle" type="button" onClick={onOpenEvidence}>
        근거 보기
      </button>
    </header>
  )
}
