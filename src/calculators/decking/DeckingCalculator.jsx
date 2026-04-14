import { useMemo, useState } from 'react'
import InputField from '../../components/InputField.jsx'
import SelectField from '../../components/SelectField.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import ResultsPanel from '../../components/ResultsPanel.jsx'
import { calcDecking } from './deckingCalc.js'

const POST_SPACING_OPTIONS = [
  { value: '6',  label: '6 ft on center' },
  { value: '8',  label: '8 ft on center (recommended)' },
]

const JOIST_SPACING_OPTIONS = [
  { value: '12', label: '12" on center' },
  { value: '16', label: '16" on center (standard)' },
]

const BOARD_LENGTH_OPTIONS = [
  { value: '12', label: "12′ Trex boards" },
  { value: '16', label: "16′ Trex boards" },
  { value: '20', label: "20′ Trex boards" },
]

export default function DeckingCalculator() {
  const [inputs, setInputs] = useState({
    deckLength:      '',
    deckWidth:       '',
    deckHeight:      '2',
    postSpacing:     '8',
    joistSpacing:    '16',
    boardLength:     '16',
    attachedToHouse: true,
  })

  const set = (key) => (val) => setInputs(prev => ({ ...prev, [key]: val }))

  const results = useMemo(() => calcDecking(inputs), [inputs])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Decking</h2>
        <p className="text-sm text-slate-500 mt-1">Estimate composite decking, framing, hardware, and concrete for a pressure treated deck structure.</p>
      </div>

      <SectionCard title="Deck Dimensions">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InputField label="Deck Length"      value={inputs.deckLength}  onChange={set('deckLength')}  unit="ft" />
          <InputField label="Deck Width/Depth" value={inputs.deckWidth}   onChange={set('deckWidth')}   unit="ft" />
          <InputField label="Height Above Grade" value={inputs.deckHeight} onChange={set('deckHeight')} unit="ft" placeholder="2" />
        </div>
        <p className="text-xs text-slate-400 mt-2">Length runs parallel to the house. Width/depth extends outward.</p>
      </SectionCard>

      <SectionCard title="Framing">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectField label="Post Spacing"      value={inputs.postSpacing}  onChange={set('postSpacing')}  options={POST_SPACING_OPTIONS} />
          <SelectField label="Joist Spacing"     value={inputs.joistSpacing} onChange={set('joistSpacing')} options={JOIST_SPACING_OPTIONS} />
          <SelectField label="Trex Board Length" value={inputs.boardLength}  onChange={set('boardLength')}  options={BOARD_LENGTH_OPTIONS} />
        </div>
      </SectionCard>

      <SectionCard title="Options">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={inputs.attachedToHouse}
            onChange={e => setInputs(prev => ({ ...prev, attachedToHouse: e.target.checked }))}
            className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
          />
          <div>
            <span className="text-sm text-slate-700">Attached to house (ledger mount)</span>
            <p className="text-xs text-slate-400 mt-0.5">Adds a 2×10 ledger board and reduces post rows on the house side.</p>
          </div>
        </label>
      </SectionCard>

      <ResultsPanel items={results} />
    </div>
  )
}
