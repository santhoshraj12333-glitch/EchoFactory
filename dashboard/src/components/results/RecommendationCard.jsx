import { FiCheckCircle, FiAlertTriangle, FiTool } from 'react-icons/fi'

export default function RecommendationCard({ abnormal }) {
  const Message = abnormal
    ? {
        title: 'Possible mechanical anomaly detected',
        body: 'Inspect bearings and pump housing. Schedule an early maintenance check.',
        icon: FiAlertTriangle,
        cardClass: 'border-brand-danger/40 bg-brand-danger/5',
        badgeClass: 'bg-brand-danger/15 text-brand-danger',
      }
    : {
        title: 'Machine operating normally',
        body: 'No maintenance required. Continue routine monitoring.',
        icon: FiCheckCircle,
        cardClass: 'border-brand-success/40 bg-brand-success/5',
        badgeClass: 'bg-brand-success/15 text-brand-success',
      }

  const Icon = Message.icon

  return (
    <div className={`flex items-start gap-4 rounded-card border p-5 ${Message.cardClass}`}>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${Message.badgeClass}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-brand-text">{Message.title}</p>
        <p className="mt-1 text-sm text-brand-muted">{Message.body}</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-brand-muted">
          <FiTool /> Recommended next step requires human inspection.
        </p>
      </div>
    </div>
  )
}