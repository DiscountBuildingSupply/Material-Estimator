import { useMemo, useState } from 'react'
import InputField from '../../components/InputField.jsx'
import SelectField from '../../components/SelectField.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import ResultsPanel from '../../components/ResultsPanel.jsx'
import { calcConcrete } from './concreteCalc.js'

const SUBTYPE_OPTIONS = [
  { value: 'slab', label: 'Concrete Slab' },
  { value: 'footing', label: 'Strip Footing' },
  { value: 'blockWall', label: 'CMU Block Wall' },
]

const REBAR_SPACING_OPTIONS = [
  { value: '12', label: '12" on center' },
  { value: '18', label: '18" on center' },
  { value: '24', label: '24" on center' },
  { value: '0',  label: 'No rebar' },
]

export default function ConcreteCalculator() {
  const [inputs, setInputs] = useState({
    subType: 'slab',
    length: '', width: '', thickness: '4',
    depth: '', height: '',
    rebarSpacing: '12',
  })

  const set = (key) => (val) => setInputs(prev => ({ ...prev, [key]: val }))

  const results = useMemo(() => calcConcrete(inputs), [inputs])

  const { subType } = inputs

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Concrete / Masonry</h2>
        <p className="text-sm text-slate-500 mt-1">Estimate concrete volume, rebar, and CMU blocks for slabs, footings, and block walls.</p>
      </div>

      <SectionCard title="Project Type">
        <div className="max-w-xs">
          <SelectField label="What are you building?" value={subType} onChange={set('subType')} options={SUBTYPE_OPTIONS} />
        </div>
      </SectionCard>

      <SectionCard title="Dimensions">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InputField label="Length" value={inputs.length} onChange={set('length')} unit="ft" />
          {subType !== 'blockWall' && (
            <InputField label="Width" value={inputs.width} onChange={set('width')} unit="ft" />
          )}
          {subType === 'slab' && (
            <InputField label="Thickness" value={inputs.thickness} onChange={set('thickness')} unit="in" placeholder="4" />
          )}
          {subType === 'footing' && (
            <>
              <InputField label="Footing Width" value={inputs.width} onChange={set('width')} unit="ft" placeholder="1.5" />
              <InputField label="Footing Depth" value={inputs.depth} onChange={set('depth')} unit="ft" placeholder="1" />
            </>
          )}
          {subType === 'blockWall' && (
            <InputField label="Wall Height" value={inputs.height} onChange={set('height')} unit="ft" />
          )}
        </div>
      </SectionCard>

      {(subType === 'slab' || subType === 'footing') && (
        <SectionCard title="Reinforcement">
          <div className="max-w-xs">
            <SelectField label="Rebar Spacing" value={inputs.rebarSpacing} onChange={set('rebarSpacing')} options={REBAR_SPACING_OPTIONS} />
          </div>
        </SectionCard>
      )}

      <ResultsPanel items={results} />
    </div>
  )
}
