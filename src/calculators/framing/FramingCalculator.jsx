import { useMemo, useState } from 'react'
import InputField from '../../components/InputField.jsx'
import SelectField from '../../components/SelectField.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import ResultsPanel from '../../components/ResultsPanel.jsx'
import { calcFraming } from './framingCalc.js'

const SPACING_OPTIONS = [
  { value: '12', label: '12" on center' },
  { value: '16', label: '16" on center (standard)' },
  { value: '24', label: '24" on center' },
]

let nextId = 1

export default function FramingCalculator() {
  const [walls, setWalls] = useState([{ id: nextId++, length: '' }])
  const [wallHeight, setWallHeight] = useState('8')
  const [spacing, setSpacing] = useState('16')
  const [floor, setFloor] = useState({ width: '', length: '' })
  const [roof, setRoof] = useState({ span: '', length: '', pitch: '' })

  const addWall = () => setWalls(prev => [...prev, { id: nextId++, length: '' }])
  const removeWall = (id) => setWalls(prev => prev.filter(w => w.id !== id))
  const setWallLength = (id, val) =>
    setWalls(prev => prev.map(w => w.id === id ? { ...w, length: val } : w))

  const inputs = { walls, wallHeight, spacing, floor, roof }
  const results = useMemo(() => calcFraming(inputs), [inputs])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Framing / Lumber</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Calculate studs, plates, joists, sheathing, and rafters. Fill in only the sections that apply.</p>
      </div>

      <SectionCard title="Walls">
        <div className="grid grid-cols-2 gap-4 mb-4 max-w-sm">
          <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" />
          <SelectField label="Stud Spacing" value={spacing} onChange={setSpacing} options={SPACING_OPTIONS} />
        </div>

        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Wall Lengths</p>
        <div className="flex flex-col gap-2">
          {walls.map((wall, i) => (
            <div key={wall.id} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-16 shrink-0">Wall {i + 1}</span>
              <input
                type="number"
                value={wall.length}
                onChange={e => setWallLength(wall.id, e.target.value)}
                min={0}
                step="any"
                placeholder="length"
                className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
              <span className="text-xs text-slate-400 w-4 shrink-0">ft</span>
              {walls.length > 1 && (
                <button
                  onClick={() => removeWall(wall.id)}
                  className="text-slate-300 hover:text-rose-400 transition-colors shrink-0"
                  title="Remove wall"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addWall}
          className="mt-3 flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add wall
        </button>
      </SectionCard>

      <SectionCard title="Floor">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Floor Width" value={floor.width} onChange={v => setFloor(f => ({ ...f, width: v }))} unit="ft" />
          <InputField label="Floor Length" value={floor.length} onChange={v => setFloor(f => ({ ...f, length: v }))} unit="ft" />
        </div>
      </SectionCard>

      <SectionCard title="Roof">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InputField label="Roof Span" value={roof.span} onChange={v => setRoof(r => ({ ...r, span: v }))} unit="ft" placeholder="e.g. 24" />
          <InputField label="Ridge Length" value={roof.length} onChange={v => setRoof(r => ({ ...r, length: v }))} unit="ft" />
          <InputField label="Roof Pitch" value={roof.pitch} onChange={v => setRoof(r => ({ ...r, pitch: v }))} unit="/12" placeholder="e.g. 6" />
        </div>
        <p className="text-xs text-slate-400 mt-2">Pitch: enter rise per 12" of run (e.g. "6" for 6:12 pitch)</p>
      </SectionCard>

      <ResultsPanel items={results} />
    </div>
  )
}
