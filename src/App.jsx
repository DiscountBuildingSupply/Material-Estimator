import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import FramingCalculator from './calculators/framing/FramingCalculator.jsx'
import ConcreteCalculator from './calculators/concrete/ConcreteCalculator.jsx'
import RoofingCalculator from './calculators/roofing/RoofingCalculator.jsx'
import DrywallCalculator from './calculators/drywall/DrywallCalculator.jsx'
import SidingCalculator from './calculators/siding/SidingCalculator.jsx'
import DeckingCalculator from './calculators/decking/DeckingCalculator.jsx'
import FencingCalculator from './calculators/fencing/FencingCalculator.jsx'
import LandscapingCalculator from './calculators/landscaping/LandscapingCalculator.jsx'

const CALCULATORS = {
  framing:      <FramingCalculator />,
  concrete:     <ConcreteCalculator />,
  roofing:      <RoofingCalculator />,
  drywall:      <DrywallCalculator />,
  siding:       <SidingCalculator />,
  decking:      <DeckingCalculator />,
  fencing:      <FencingCalculator />,
  landscaping:  <LandscapingCalculator />,
}

export default function App() {
  const [active, setActive] = useState('framing')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar active={active} onSelect={setActive} darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {CALCULATORS[active]}
        </div>
      </main>
    </div>
  )
}
