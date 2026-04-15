import { useMemo, useState } from 'react'
import InputField from '../../components/InputField.jsx'
import SelectField from '../../components/SelectField.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import ResultsPanel from '../../components/ResultsPanel.jsx'
import { calcRoofing } from './roofingCalc.js'

const UNDERLAYMENT_OPTIONS = [
  { value: '15lb', label: '15 lb felt (400 sq ft/roll)' },
  { value: '30lb', label: '30 lb felt (200 sq ft/roll)' },
  { value: 'synthetic', label: 'Synthetic (1000 sq ft/roll)' },
]

const ICE_SHIELD_OPTIONS = [
  { value: '2', label: '2 rows (standard)' },
  { value: '3', label: '3 rows (cold climate)' },
  { value: '1', label: '1 row (minimal)' },
  { value: '0', label: 'None' },
]

export default function RoofingCalculator() {
  const [inputs, setInputs] = useState({
    ridgeLength: '', roofWidth: '', pitch: '',
    iceShieldRows: '2', underlaymentType: '15lb',
  })

  const set = (key) => (val) => setInputs(prev => ({ ...prev, [key]: val }))

  const results = useMemo(() => calcRoofing(inputs), [inputs])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Roofing</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Calculate shingles, underlayment, ice & water shield, and nails for a gable roof.</p>
      </div>

      <SectionCard title="Roof Dimensions">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InputField label="Ridge Length" value={inputs.ridgeLength} onChange={set('ridgeLength')} unit="ft" placeholder="e.g. 40" />
          <InputField label="Rafter Run (one side)" value={inputs.roofWidth} onChange={set('roofWidth')} unit="ft" placeholder="e.g. 14" />
          <InputField label="Roof Pitch" value={inputs.pitch} onChange={set('pitch')} unit="/12" placeholder="e.g. 6" />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Rafter run = half the building width. Pitch = rise per 12" of run (e.g. "6" for 6:12).
        </p>
      </SectionCard>

      <SectionCard title="Materials">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField label="Underlayment Type" value={inputs.underlaymentType} onChange={set('underlaymentType')} options={UNDERLAYMENT_OPTIONS} />
          <SelectField label="Ice & Water Shield" value={inputs.iceShieldRows} onChange={set('iceShieldRows')} options={ICE_SHIELD_OPTIONS} />
        </div>
      </SectionCard>

      <ResultsPanel items={results} />
    </div>
  )
}
