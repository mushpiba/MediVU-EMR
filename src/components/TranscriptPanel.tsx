import type { TranscriptEvent } from '../domain/types'

interface TranscriptPanelProps {
  events: TranscriptEvent[]
  isPlaying: boolean
  isComplete: boolean
  onTogglePlayback: () => void
}

export function TranscriptPanel({
  events,
  isPlaying,
  isComplete,
  onTogglePlayback,
}: TranscriptPanelProps) {
  const buttonLabel = isPlaying ? '일시정지' : isComplete ? '다시 재생' : events.length ? '계속 재생' : '대화 재생'

  return (
    <section className="panel transcript-panel" aria-labelledby="transcript-title">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">AMBIENT LISTENING</span>
          <h2 id="transcript-title">실시간 진료 대화</h2>
        </div>
        <span className={`live-state ${isPlaying ? 'is-live' : ''}`}>
          <span aria-hidden="true" />
          {isPlaying ? '수집 중' : '대기'}
        </span>
      </div>

      <div className="transcript-stream" aria-live="polite">
        {events.length === 0 ? (
          <div className="empty-transcript">
            <span aria-hidden="true">◉</span>
            <strong>대화를 시작할 준비가 됐습니다</strong>
            <p>재생하면 가상 진료 대화와 임상 키워드가 순차적으로 표시됩니다.</p>
          </div>
        ) : (
          events.map((event) => (
            <article key={event.id} className={`transcript-line is-${event.speaker}`}>
              <span className="speaker-avatar" aria-hidden="true">
                {event.speaker === 'doctor' ? 'Dr' : 'Pt'}
              </span>
              <div>
                <strong>{event.speaker === 'doctor' ? '의사' : '환자'}</strong>
                <p>{event.text}</p>
              </div>
            </article>
          ))
        )}
      </div>

      <button className="playback-button" type="button" onClick={onTogglePlayback}>
        <span aria-hidden="true">{isPlaying ? 'Ⅱ' : '▶'}</span>
        {buttonLabel}
      </button>
    </section>
  )
}
