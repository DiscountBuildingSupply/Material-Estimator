import { useMemo, useState } from 'react'
import InputField from '../../components/InputField.jsx'
import SelectField from '../../components/SelectField.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import ResultsPanel from '../../components/ResultsPanel.jsx'
import { calcConcrete } from './concreteCalc.js'

const SUBTYPE_OPTIONS = [
  { value: 'slab',         label: 'Concrete Slab' },
  { value: 'footing',      label: 'Strip Footing' },
  { value: 'blockWall',    label: 'CMU Block Wall' },
  { value: 'typeSMortar',  label: 'Type S Mortar (from scratch)' },
  { value: 'siteMix',      label: 'Site-Mixed Concrete (Portland + sand + gravel)' },
]

const REBAR_SPACING_OPTIONS = [
  { value: '12', label: '12" on center' },
  { value: '18', label: '18" on center' },
  { value: '24', label: '24" on center' },
  { value: '0',  label: 'No rebar' },
]

const MORTAR_APP_OPTIONS = [
  { value: 'blockWall', label: 'CMU Block Wall' },
  { value: 'stone',     label: 'Stone / Brick / Pointing' },
]

export default function ConcreteCalculator() {
  const [inputs, setInputs] = useState({
    subType: 'slab',
    length: '', width: '', thickness: '4',
    depth: '', height: '',
    rebarSpacing: '12',
    mortarApp: 'blockWall',
  })

  const set = (key) => (val) => setInputs(prev => ({ ...prev, [key]: val }))

  const results = useMemo(() => calcConcrete(inputs), [inputs])

  const { subType } = inputs
  const isMortar   = subType === 'typeSMortar'
  const isSiteMix  = subType === 'siteMix'

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Concrete / Masonry</h2>
        <p className="text-sm text-slate-500 mt-1">Estimate concrete volume, rebar, CMU blocks, and scratch-mixed mortar or concrete.</p>
      </div>

      <SectionCard title="Project Type">
        <div className="max-w-sm">
          <SelectField label="What are you building?" value={subType} onChange={set('subType')} options={SUBTYPE_OPTIONS} />
        </div>
      </SectionCard>

      {/* Type S Mortar */}
      {isMortar && (
        <>
          <SectionCard title="Application">
            <div className="max-w-xs">
              <SelectField label="Mortar Application" value={inputs.mortarApp} onChange={set('mortarApp')} options={MORTAR_APP_OPTIONS} />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {inputs.mortarApp === 'blockWall'
                ? 'Calculated from block count at standard 3/8" joints.'
                : 'Stone/brick/pointing uses ~0.5 cu ft mortar per sq ft of wall face.'}
            </p>
          </SectionCard>
          <SectionCard title="Dimensions">
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <InputField label="Wall Length" value={inputs.length} onChange={set('length')} unit="ft" />
              <InputField label="Wall Height" value={inputs.height} onChange={set('height')} unit="ft" />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Type S mix ratio: 1 part Portland cement : ½ part hydrated lime : 4½ parts mason sand
            </p>
          </SectionCard>
        </>
      )}

      {/* Site-Mixed Concrete */}
      {isSiteMix && (
        <SectionCard title="Slab Dimensions">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InputField label="Length" value={inputs.length} onChange={set('length')} unit="ft" />
            <InputField label="Width"  value={inputs.width}  onChange={set('width')}  unit="ft" />
            <InputField label="Thickness" value={inputs.thickness} onChange={set('thickness')} unit="in" placeholder="4" />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            1:2:3 mix — 1 part Portland cement : 2 parts sand : 3 parts gravel/aggregate
          </p>
        </SectionCard>
      )}

      {/* Standard types */}
      {!isMortar && !isSiteMix && (
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
      )}

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
