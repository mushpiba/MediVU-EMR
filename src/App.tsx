import { useEffect, useState } from 'react'
import { AmbientWorkspace } from './components/AmbientWorkspace'
import { OrderWorkspace } from './components/OrderWorkspace'
import { demoScenario } from './data/demoScenario'
import type { DiagnosisTag, Keyword } from './domain/types'

interface OrderContext {
  diagnosisId: string
  keywords: Keyword[]
  tags: DiagnosisTag[]
}

function currentHash() {
  return window.location.hash || '#/ambient'
}

export function App() {
  const [route, setRoute] = useState(currentHash)
  const [orderContext, setOrderContext] = useState<OrderContext | null>(null)

  useEffect(() => {
    const handleHashChange = () => setRoute(currentHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (hash: string) => {
    window.location.hash = hash
    setRoute(hash)
  }

  const orderMatch = route.match(/^#\/orders\/([^/]+)$/)
  if (orderMatch) {
    const diagnosisId = orderMatch[1]
    const diagnosis = demoScenario.diagnoses.find(({ id }) => id === diagnosisId)
    const template = demoScenario.orderTemplates.find(
      ({ diagnosisId: templateDiagnosisId }) => templateDiagnosisId === diagnosisId,
    )

    if (diagnosis && template) {
      const fallbackKeywords = demoScenario.keywords.filter(({ id }) =>
        demoScenario.initialKeywordIds.includes(id),
      )

      return (
        <OrderWorkspace
          patient={demoScenario.patient}
          diagnosis={diagnosis}
          template={template}
          keywords={orderContext?.diagnosisId === diagnosisId ? orderContext.keywords : fallbackKeywords}
          tags={orderContext?.diagnosisId === diagnosisId ? orderContext.tags : diagnosis.tags ?? []}
          onBack={() => navigate('#/ambient')}
          onReset={() => {
            setOrderContext(null)
            navigate('#/ambient')
          }}
        />
      )
    }
  }

  return (
    <AmbientWorkspace
      scenario={demoScenario}
      onSelectDiagnosis={(diagnosisId, keywords, tags) => {
        setOrderContext({ diagnosisId, keywords, tags })
        navigate(`#/orders/${diagnosisId}`)
      }}
    />
  )
}
