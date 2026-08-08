import { motion } from 'framer-motion'
import { FiCpu, FiLock } from 'react-icons/fi'
import SpotlightCard from '../ui/SpotlightCard.jsx'

const MACHINES = [
  { id: 'pump', label: 'Pump', available: true, desc: 'Supported' },
  { id: 'motor', label: 'Motor', available: false },
  { id: 'fan', label: 'Fan', available: false },
  { id: 'bearing', label: 'Bearing', available: false },
  { id: 'valve', label: 'Valve', available: false },
]

export default function MachineSelector({ selected, onSelect }) {
  const active = MACHINES.find((m) => m.id === selected)

  return (
    <section id="machine-selection" className="mx-auto max-w-6xl py-12 scroll-mt-24">
      <div className="mb-6 flex items-end justify-between px-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-text">Select Machine</h2>
          <p className="mt-1 text-sm text-brand-muted">
            Choose the equipment type to analyze.
          </p>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-brand-border bg-brand-card px-4 py-1.5 text-sm text-brand-muted sm:inline-flex">
          <FiCpu className="text-brand-forest" /> {active?.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {MACHINES.map((machine, i) => {
          const isSelected = machine.id === selected
          return (
            <motion.button
              key={machine.id}
              type="button"
              disabled={!machine.available}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              onClick={() => onSelect(machine.id)}
              className="text-left disabled:cursor-not-allowed"
            >
              <SpotlightCard
                className={`h-full w-full p-5 transition-all ${
                  isSelected
                    ? 'border-brand-forest bg-brand-surface'
                    : 'disabled:opacity-45'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isSelected
                        ? 'bg-brand-forest text-brand-primary'
                        : 'bg-brand-surface text-brand-muted'
                    }`}
                  >
                    <FiCpu className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-brand-text">{machine.label}</span>
                  {machine.available ? (
                    isSelected && <span className="text-xs font-medium text-brand-forest">Active</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-brand-muted">
                      <FiLock className="h-3 w-3" /> Coming Soon
                    </span>
                  )}
                </div>
              </SpotlightCard>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}