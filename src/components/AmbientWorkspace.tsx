import { useState } from 'react'
import type { DemoScenario, DiagnosisTag, Keyword } from '../domain/types'
import { useDemoEncounter } from '../hooks/useDemoEncounter'
import { DiagnosisList } from './DiagnosisList'
import { EvidencePanel } from './EvidencePanel'
import { KeywordBoard } from './KeywordBoard'
import { PatientHeader } from './PatientHeader'
import { Sidebar } from './Sidebar'
import { TranscriptPanel } from './TranscriptPanel'

interface AmbientWorkspaceProps {
  scenario: DemoScenario
  onSelectDiagnosis: (
    diagnosisId: string,
    keywords: Keyword[],
    tags: DiagnosisTag[],
  ) => void
}

export function AmbientWorkspace({ scenario, onSelectDiagnosis }: AmbientWorkspaceProps) {
  const encounter = useDemoEncounter(scenario)
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar onReset={encounter.resetDemo} />
      <div className="clinical-app">
        <PatientHeader patient={scenario.patient} onOpenEvidence={() => setIsEvidenceOpen(true)} />
        <main className="ambient-workspace">
          <TranscriptPanel
            events={encounter.visibleTranscript}
            isPlaying={encounter.isPlaying}
            isComplete={encounter.visibleTranscriptCount >= scenario.transcript.length}
            onTogglePlayback={encounter.togglePlayback}
          />
          <div className="decision-column">
            <KeywordBoard
              keywords={encounter.activeKeywords}
              notice={encounter.keywordNotice}
              onAdd={encounter.addKeyword}
              onRemove={encounter.removeKeyword}
            />
            <DiagnosisList
              diagnoses={encounter.rankedDiagnoses}
              keywords={encounter.activeKeywords}
              tagsByDiagnosis={encounter.tagsByDiagnosis}
              onAddTag={encounter.addDiagnosisTag}
              onRemoveTag={encounter.removeDiagnosisTag}
              onSelect={(diagnosisId) =>
                onSelectDiagnosis(
                  diagnosisId,
                  encounter.activeKeywords,
                  encounter.tagsByDiagnosis[diagnosisId] ?? [],
                )
              }
            />
          </div>
          <EvidencePanel
            evidence={scenario.evidence}
            isOpen={isEvidenceOpen}
            onClose={() => setIsEvidenceOpen(false)}
          />
        </main>
      </div>
    </div>
  )
}
