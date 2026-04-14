import { useMemo, useState } from 'react'
import InputField from '../../components/InputField.jsx'
import SelectField from '../../components/SelectField.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import ResultsPanel from '../../components/ResultsPanel.jsx'
import { calcLandscaping, MATERIAL_WEIGHTS } from './landscapingCalc.js'

const MATERIAL_OPTIONS = Object.entries(MATERIAL_WEIGHTS).map(([value, { label }]) => ({ value, label }))

let nextId = 1

const newArea = () => ({ id: nextId++, shape: 'rect', length: '', width: '', diameter: '' })

export default function LandscapingCalculator() {
  const [areas,    setAreas]    = useState([newArea()])
  const [depth,    setDepth]    = useState('3')
  const [material, setMaterial] = useState('mulch-hardwood')

  const addArea    = () => setAreas(prev => [...prev, newArea()])
  const removeArea = (id) => setAreas(prev => prev.filter(a => a.id !== id))
  const updateArea = (id, key, val) =>
    setAreas(prev => prev.map(a => a.id === id ? { ...a, [key]: val } : a))

  const inputs  = { areas, depth, material }
  const results = useMemo(() => calcLandscaping(inputs), [inputs])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Landscaping</h2>
        <p className="text-sm text-slate-500 mt-1">Calculate half-ton quantities of mulch or gravel for rectangular and circular areas.</p>
      </div>

      <SectionCard title="Material & Depth">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField label="Material" value={material} onChange={setMaterial} options={MATERIAL_OPTIONS} />
          <InputField  label="Depth"    value={depth}    onChange={setDepth}    unit="in" placeholder="3" step="0.5" />
        </div>
      </SectionCard>

      <SectionCard title="Areas">
        <div className="flex flex-col gap-4">
          {areas.map((area, i) => (
            <div key={area.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">Area {i + 1}</span>
                <div className="flex items-center gap-3">
                  {/* Shape toggle */}
                  <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
                    <button
                      onClick={() => updateArea(area.id, 'shape', 'rect')}
                      className={`px-3 py-1.5 transition-colors ${area.shape === 'rect' ? 'bg-brand-500 text-white font-medium' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                      Rectangle
                    </button>
                    <button
                      onClick={() => updateArea(area.id, 'shape', 'circle')}
                      className={`px-3 py-1.5 transition-colors ${area.shape === 'circle' ? 'bg-brand-500 text-white font-medium' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                      Circle
                    </button>
                  </div>
                  {areas.length > 1 && (
                    <button
                      onClick={() => removeArea(area.id)}
                      className="text-slate-300 hover:text-rose-400 transition-colors"
                      title="Remove area"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {area.shape === 'rect' ? (
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Length" value={area.length}   onChange={v => updateArea(area.id, 'length',   v)} unit="ft" />
                  <InputField label="Width"  value={area.width}    onChange={v => updateArea(area.id, 'width',    v)} unit="ft" />
                </div>
              ) : (
                <div className="max-w-[160px]">
                  <InputField label="Diameter" value={area.diameter} onChange={v => updateArea(area.id, 'diameter', v)} unit="ft" />
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addArea}
          className="mt-3 flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add area
        </button>
      </SectionCard>

      <ResultsPanel items={results} />
    </div>
  )
}
