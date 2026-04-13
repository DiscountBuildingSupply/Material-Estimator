import { useMemo, useState } from 'react'
import InputField from '../../components/InputField.jsx'
import SelectField from '../../components/SelectField.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import ResultsPanel from '../../components/ResultsPanel.jsx'
import { calcFraming } from './framingCalc.js'

const SPACING_OPTIONS = [
  { value: '16', label: '16" on center (standard)' },
  { value: '24', label: '24" on center' },
]

export default function FramingCalculator() {
  const [inputs, setInputs] = useState({
    wallLength: '', wallHeight: '8', numWalls: '1', spacing: '16',
    floorWidth: '', floorLength: '',
    roofSpan: '', roofLength: '', roofPitch: '',
  })

  const set = (key) => (val) => setInputs(prev => ({ ...prev, [key]: val }))

  const results = useMemo(() => calcFraming(inputs), [inputs])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Framing / Lumber</h2>
        <p className="text-sm text-slate-500 mt-1">Calculate studs, plates, joists, sheathing, and rafters. Fill in only the sections that apply.</p>
      </div>

      <SectionCard title="Walls">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InputField label="Wall Length" value={inputs.wallLength} onChange={set('wallLength')} unit="ft" />
          <InputField label="Wall Height" value={inputs.wallHeight} onChange={set('wallHeight')} unit="ft" />
          <InputField label="Number of Walls" value={inputs.numWalls} onChange={set('numWalls')} unit="walls" step="1" />
        </div>
        <div className="mt-4 max-w-xs">
          <SelectField label="Stud Spacing" value={inputs.spacing} onChange={set('spacing')} options={SPACING_OPTIONS} />
        </div>
      </SectionCard>

      <SectionCard title="Floor">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Floor Width" value={inputs.floorWidth} onChange={set('floorWidth')} unit="ft" />
          <InputField label="Floor Length" value={inputs.floorLength} onChange={set('floorLength')} unit="ft" />
        </div>
      </SectionCard>

      <SectionCard title="Roof">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InputField label="Roof Span" value={inputs.roofSpan} onChange={set('roofSpan')} unit="ft" placeholder="e.g. 24" />
          <InputField label="Ridge Length" value={inputs.roofLength} onChange={set('roofLength')} unit="ft" />
          <InputField label="Roof Pitch" value={inputs.roofPitch} onChange={set('roofPitch')} unit="/12" placeholder="e.g. 6" />
        </div>
        <p className="text-xs text-slate-400 mt-2">Pitch: enter rise per 12" of run (e.g. "6" for 6:12 pitch)</p>
      </SectionCard>

      <ResultsPanel items={results} />
    </div>
  )
}
