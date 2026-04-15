import { useMemo, useState } from 'react'
import InputField from '../../components/InputField.jsx'
import SelectField from '../../components/SelectField.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import ResultsPanel from '../../components/ResultsPanel.jsx'
import { calcSiding } from './sidingCalc.js'

const PRODUCT_OPTIONS = [
  { value: 'dutchlap',     label: '4.5" Dutchlap Siding' },
  { value: 'hardie-lap',   label: 'Hardie 8-1/4" Lap Siding' },
  { value: 'hardie-sheet', label: 'Hardie Sheet Siding' },
]

const SHEET_SIZE_OPTIONS = [
  { value: '4x8',  label: '4×8 (32 sq ft)' },
  { value: '4x9',  label: '4×9 (36 sq ft)' },
  { value: '4x10', label: '4×10 (40 sq ft)' },
]

let nextId = 1

export default function SidingCalculator() {
  const [walls, setWalls]         = useState([{ id: nextId++, length: '' }])
  const [wallHeight, setWallHeight] = useState('8')
  const [numDoors, setNumDoors]   = useState('0')
  const [numWindows, setNumWindows] = useState('0')
  const [product, setProduct]     = useState('dutchlap')
  const [sheetSize, setSheetSize] = useState('4x8')

  const addWall    = () => setWalls(prev => [...prev, { id: nextId++, length: '' }])
  const removeWall = (id) => setWalls(prev => prev.filter(w => w.id !== id))
  const setWallLength = (id, val) =>
    setWalls(prev => prev.map(w => w.id === id ? { ...w, length: val } : w))

  const inputs = { walls, wallHeight, numDoors, numWindows, product, sheetSize }
  const results = useMemo(() => calcSiding(inputs), [inputs])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Siding</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Estimate siding quantities for Dutchlap and Hardie products. Add each wall separately.</p>
      </div>

      <SectionCard title="Walls">
        <div className="grid grid-cols-2 gap-4 mb-4 max-w-sm">
          <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" />
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

      <SectionCard title="Openings">
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <InputField label="Doors" value={numDoors} onChange={setNumDoors} unit="doors" step="1" placeholder="0" />
          <InputField label="Windows" value={numWindows} onChange={setNumWindows} unit="windows" step="1" placeholder="0" />
        </div>
        <p className="text-xs text-slate-400 mt-2">Deducted from wall area (~21 sq ft/door, ~15 sq ft/window).</p>
      </SectionCard>

      <SectionCard title="Product">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField label="Siding Type" value={product} onChange={setProduct} options={PRODUCT_OPTIONS} />
          {product === 'hardie-sheet' && (
            <SelectField label="Sheet Size" value={sheetSize} onChange={setSheetSize} options={SHEET_SIZE_OPTIONS} />
          )}
        </div>
      </SectionCard>

      <ResultsPanel items={results} />
    </div>
  )
}
