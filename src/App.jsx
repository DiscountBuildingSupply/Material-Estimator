import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import FramingCalculator from './calculators/framing/FramingCalculator.jsx'
import ConcreteCalculator from './calculators/concrete/ConcreteCalculator.jsx'
import RoofingCalculator from './calculators/roofing/RoofingCalculator.jsx'
import DrywallCalculator from './calculators/drywall/DrywallCalculator.jsx'
import SidingCalculator from './calculators/siding/SidingCalculator.jsx'
import LandscapingCalculator from './calculators/landscaping/LandscapingCalculator.jsx'
import FencingCalculator from './calculators/fencing/FencingCalculator.jsx'
import DeckingCalculator from './calculators/decking/DeckingCalculator.jsx'

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar active={active} onSelect={setActive} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {CALCULATORS[active]}
        </div>
      </main>
    </div>
  )
}
