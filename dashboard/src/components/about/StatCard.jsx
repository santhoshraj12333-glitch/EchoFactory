export default function StatCard({ label, value }) {
  return (
    <div className="rounded-card border border-brand-border bg-brand-card p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-brand-forest">{value}</p>
    </div>
  )
}