import type { OrderStage } from '../types'

interface OrderTimelineProps {
  status: string
  stages?: OrderStage[]
  statusHistory?: { status: string; timestamp: string; source: string }[]
}

const STEPS = [
  { key: 'ORDER_CREATED', label: 'Pedido creado', icon: '/LogoRappi.webp' },
  { key: 'ORDER_RECEIVED', label: 'Recibido en cocina', icon: '/LogoRappi.webp' },
  { key: 'COOKED', label: 'Cocinado', icon: '/cocina.png' },
  { key: 'PACKED', label: 'Empacado', icon: '/MochilaRappi_pedidoListoParaSalir.png' },
  { key: 'DELIVERED', label: 'En camino / entregado', icon: '/CarroRappi.png' },
  { key: 'COMPLETED', label: 'Completado', icon: '/EntregandoPedido.png' },
]

function getStepIndex(status: string): number {
  return STEPS.findIndex((s) => s.key === status)
}

export default function OrderTimeline({ status, stages, statusHistory }: OrderTimelineProps) {
  const currentIndex = getStepIndex(status)

  function getEntryForStep(stepKey: string) {
    return statusHistory?.find((h) => h.status === stepKey) || null
  }

  return (
    <div className="space-y-0">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex
        const isActive = index === currentIndex
        const stage = stages?.[index]
        const entry = getEntryForStep(step.key)

        return (
          <div key={step.key} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}>
            <div className="flex flex-col items-center">
              <div
                className={`relative size-10 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  isCompleted ? 'bg-rappi-green' : isActive ? 'bg-rappi ring-4 ring-rappi/20' : 'bg-gray-100'
                }`}
              >
                <img src={step.icon} alt="" className={`size-5 object-contain ${isCompleted || isActive ? '' : 'opacity-40 saturate-0'}`} />
                {isActive && <span className="absolute inset-0 rounded-full bg-rappi/40 animate-ping" />}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-0.5 h-8 ${isCompleted ? 'bg-rappi-green' : 'bg-gray-200'}`} />
              )}
            </div>
            <div className="pb-8 pt-1">
              <p className={`text-sm font-medium ${isActive ? 'text-rappi' : isCompleted ? 'text-rappi-green' : 'text-gray-400'}`}>
                {step.label}
              </p>
              {entry && (
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs text-gray-400">
                    {new Date(entry.timestamp).toLocaleString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[10px] text-gray-300 uppercase">{entry.source}</p>
                </div>
              )}
              {stage && (stage.startTime || stage.assignedTo) && (
                <div className="mt-1 space-y-0.5">
                  {stage.assignedTo && <p className="text-xs text-gray-500">Responsable: {stage.assignedTo}</p>}
                  {stage.startTime && <p className="text-xs text-gray-400">Inicio: {new Date(stage.startTime).toLocaleTimeString()}</p>}
                  {stage.endTime && <p className="text-xs text-gray-400">Fin: {new Date(stage.endTime).toLocaleTimeString()}</p>}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
