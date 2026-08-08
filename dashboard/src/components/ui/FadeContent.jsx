import { motion } from 'framer-motion'

/**
 * Scroll-triggered fade+slide reveal used selectively on section headers.
 * Subtle and engineering-suitable: fades from a couple pixels up.
 */
export default function FadeContent({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}