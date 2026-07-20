import { AmbientWorkspace } from './components/AmbientWorkspace'
import { demoScenario } from './data/demoScenario'

export function App() {
  return <AmbientWorkspace scenario={demoScenario} onSelectDiagnosis={() => undefined} />
}
