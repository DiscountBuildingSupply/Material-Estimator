import { useMemo, useState } from 'react'
import InputField from '../../components/InputField.jsx'
import SelectField from '../../components/SelectField.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import ResultsPanel from '../../components/ResultsPanel.jsx'
import { calcDrywall } from './drywallCalc.js'

const INSULATION_TYPE_OPTIONS = [
  { value: 'batt', label: 'Batt (walls)' },
  { value: 'blown', label: 'Blown-in (ceiling/attic)' },
  { value: 'rigid', label: 'Rigid foam (walls)' },
]

const WALL_R_OPTIONS = [
  { value: '13', label: 'R-13 (2×4 wall)' },
  { value: '15', label: 'R-15 (2×4 wall, high-density)' },
  { value: '19', label: 'R-19 (2×6 wall)' },
  { value: '21', label: 'R-21 (2×6 wall, high-density)' },
]

const CEILING_R_OPTIONS = [
  { value: '30', label: 'R-30' },
  { value: '38', label: 'R-38 (recommended)' },
  { value: '49', label: 'R-49 (cold climate)' },
  { value: '60', label: 'R-60 (extreme cold)' },
]

export default function DrywallCalculator() {
  const [inputs, setInputs] = useState({
    roomLength: '', roomWidth: '', ceilingHeight: '8',
    numDoors: '1', numWindows: '2',
    insulationType: 'batt', wallInsulationR: '13', ceilingInsulationR: '38',
  })

  const set = (key) => (val) => setInputs(prev => ({ ...prev, [key]: val }))

  const results = useMemo(() => calcDrywall(inputs), [inputs])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Drywall / Insulation</h2>
        <p className="text-sm text-slate-500 mt-1">Estimate sheets, mud, tape, screws, and insulation for a single room.</p>
      </div>

      <SectionCard title="Room Dimensions">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InputField label="Room Length" value={inputs.roomLength} onChange={set('roomLength')} unit="ft" />
          <InputField label="Room Width" value={inputs.roomWidth} onChange={set('roomWidth')} unit="ft" />
          <InputField label="Ceiling Height" value={inputs.ceilingHeight} onChange={set('ceilingHeight')} unit="ft" placeholder="8" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 max-w-sm">
          <InputField label="Doors" value={inputs.numDoors} onChange={set('numDoors')} unit="doors" step="1" placeholder="1" />
          <InputField label="Windows" value={inputs.numWindows} onChange={set('numWindows')} unit="windows" step="1" placeholder="2" />
        </div>
        <p className="text-xs text-slate-400 mt-2">Door/window openings are deducted from wall area (~21 sq ft per door, ~15 sq ft per window).</p>
      </SectionCard>

      <SectionCard title="Insulation">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectField label="Insulation Type" value={inputs.insulationType} onChange={set('insulationType')} options={INSULATION_TYPE_OPTIONS} />
          {inputs.insulationType === 'batt' && (
            <SelectField label="Wall R-Value" value={inputs.wallInsulationR} onChange={set('wallInsulationR')} options={WALL_R_OPTIONS} />
          )}
          {inputs.insulationType === 'blown' && (
            <SelectField label="Ceiling R-Value" value={inputs.ceilingInsulationR} onChange={set('ceilingInsulationR')} options={CEILING_R_OPTIONS} />
          )}
        </div>
      </SectionCard>

      <ResultsPanel items={results} />
    </div>
  )
}
