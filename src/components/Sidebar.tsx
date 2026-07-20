const navigationItems = [
  { label: 'Ambient AI', icon: '✦' },
  { label: '환자 기록', icon: '▤' },
  { label: '검사 결과', icon: '⌁' },
  { label: '의료 영상', icon: '◫' },
  { label: '처방·오더', icon: '✓' },
  { label: '진료 노트', icon: '⌑' },
]

interface SidebarProps {
  onReset: () => void
  activeItem?: 'ambient' | 'orders'
}

export function Sidebar({ onReset, activeItem = 'ambient' }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-mark" aria-hidden="true">MV</div>
      <h1>MediVU EMR</h1>
      <nav aria-label="EMR 주요 메뉴">
        {navigationItems.map((item, index) => {
          const isActive = activeItem === 'ambient' ? index === 0 : index === 4

          return index === 0 ? (
            <a
              key={item.label}
              className={`nav-item ${isActive ? 'is-active' : ''}`}
              href="#/ambient"
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ) : (
            <span
              key={item.label}
              className={`nav-item ${isActive ? 'is-active' : 'is-muted'}`}
              aria-current={isActive ? 'page' : undefined}
              aria-disabled={isActive ? undefined : 'true'}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </span>
          )
        })}
      </nav>
      <button className="sidebar-reset" type="button" onClick={onReset}>
        <span aria-hidden="true">↻</span>
        데모 초기화
      </button>
    </aside>
  )
}
