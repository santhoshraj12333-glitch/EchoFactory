import { useState } from 'react'
import Hero from '../components/hero/Hero.jsx'
import MachineSelector from '../components/machine/MachineSelector.jsx'
import Analyzer from '../components/analyzer/Analyzer.jsx'

export default function Dashboard() {
  const [machine, setMachine] = useState('pump')

  return (
    <>
      <Hero onUpload={() => {
        document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })
      }} />
      <MachineSelector selected={machine} onSelect={setMachine} />
      <Analyzer machine={machine} />
    </>
  )
}