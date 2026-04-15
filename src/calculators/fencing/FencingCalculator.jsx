import { useMemo, useState } from 'react'
import InputField from '../../components/InputField.jsx'
import SelectField from '../../components/SelectField.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import ResultsPanel from '../../components/ResultsPanel.jsx'
import { calcFencing } from './fencingCalc.js'

const HEIGHT_OPTIONS = [
  { value: '6', label: '6 ft' },
  { value: '8', label: '8 ft' },
]

const POST_SPACING_OPTIONS = [
  { value: '6',  label: '6 ft on center' },
  { value: '8',  label: '8 ft on center' },
  { value: '10', label: '10 ft on center' },
]

const RUNS_OPTIONS = [
  { value: '2', label: '2 runs' },
  { value: '3', label: '3 runs' },
  { value: '4', label: '4 runs' },
]

let nextId = 1

export default function FencingCalculator() {
  const [sections, setSections]             = useState([{ id: nextId++, length: '' }])
  const [fenceHeight, setFenceHeight]       = useState('6')
  const [postSpacing, setPostSpacing]       = useState('8')
  const [numRuns, setNumRuns]               = useState('2')
  const [includePickets, setIncludePickets] = useState(true)

  const addSection    = () => setSections(prev => [...prev, { id: nextId++, length: '' }])
  const removeSection = (id) => setSections(prev => prev.filter(s => s.id !== id))
  const setSectionLength = (id, val) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, length: val } : s))

  const inputs  = { sections, fenceHeight, postSpacing, numRuns: Number(numRuns), includePickets }
  const results = useMemo(() => calcFencing(inputs), [inputs])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Fencing</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Estimate pressure treated fence materials — posts, rails, pickets, and concrete.</p>
      </div>

      <SectionCard title="Fence Specifications">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <SelectField label="Fence Height"   value={fenceHeight} onChange={setFenceHeight} options={HEIGHT_OPTIONS} />
          <SelectField label="Post Spacing"   value={postSpacing} onChange={setPostSpacing} options={POST_SPACING_OPTIONS} />
          <SelectField label="Horizontal Runs (2×4×16)" value={numRuns} onChange={setNumRuns} options={RUNS_OPTIONS} />
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Runs are 2×4×16′ PT rails that span between posts. A standard privacy fence uses 2–3 runs.
        </p>
      </SectionCard>

      <SectionCard title="Fence Sections">
        <div className="flex flex-col gap-2">
          {sections.map((section, i) => (
            <div key={section.id} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-20 shrink-0">Section {i + 1}</span>
              <input
                type="number"
                value={section.length}
                onChange={e => setSectionLength(section.id, e.target.value)}
                min={0}
                step="any"
                placeholder="length"
                className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
              <span className="text-xs text-slate-400 w-4 shrink-0">ft</span>
              {sections.length > 1 && (
                <button
                  onClick={() => removeSection(section.id)}
                  className="text-slate-300 hover:text-rose-400 transition-colors shrink-0"
                  title="Remove section"
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
          onClick={addSection}
          className="mt-3 flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add section
        </button>
      </SectionCard>

      <SectionCard title="Options">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includePickets}
            onChange={e => setIncludePickets(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Include 1×6 dog-ear pickets (privacy fence)</span>
        </label>
      </SectionCard>

      <ResultsPanel items={results} />
    </div>
  )
}
