import { toNum, ceilTo, roundTo } from '../../utils/math.js'

const WASTE_FACTOR = 1.10
const DOOR_SQFT    = 21   // standard 3×7 door
const WINDOW_SQFT  = 15   // standard 3×5 window

// Coverage per 12-ft plank at given exposure
const DUTCHLAP_EXPOSURE_IN   = 4.5
const HARDIE_LAP_EXPOSURE_IN = 8.25
const HARDIE_LAP_LENGTH_FT   = 12

const HARDIE_SHEET_SQFT = {
  '4x8':  32,
  '4x9':  36,
  '4x10': 40,
}

export function calcSiding(inputs) {
  const walls      = inputs.walls || []
  const wallHeight = toNum(inputs.wallHeight)
  const numDoors   = toNum(inputs.numDoors, 0)
  const numWindows = toNum(inputs.numWindows, 0)
  const product    = inputs.product || 'dutchlap'
  const sheetSize  = inputs.sheetSize || '4x8'

  // Build gross wall area from individual wall lengths × shared height
  const validWalls  = walls.map(w => toNum(w.length)).filter(l => l > 0)
  if (validWalls.length === 0 || wallHeight <= 0) return []

  const grossArea   = validWalls.reduce((sum, l) => sum + l * wallHeight, 0)
  const deductions  = (numDoors * DOOR_SQFT) + (numWindows * WINDOW_SQFT)
  const netArea     = Math.max(0, grossArea - deductions)
  const netWaste    = roundTo(netArea * WASTE_FACTOR)

  const items = [
    { name: 'Gross Wall Area', qty: roundTo(grossArea), unit: 'sq ft', note: `${validWalls.length} wall${validWalls.length > 1 ? 's' : ''} × ${wallHeight}′ tall` },
    { name: 'Net Area (after openings)', qty: roundTo(netArea), unit: 'sq ft', note: `${numDoors} door${numDoors !== 1 ? 's' : ''}, ${numWindows} window${numWindows !== 1 ? 's' : ''} deducted` },
  ]

  if (product === 'dutchlap') {
    // Dutchlap 4.5": sold by the square (100 sq ft box)
    const exposureFt  = DUTCHLAP_EXPOSURE_IN / 12
    const linFt       = netWaste / exposureFt
    const squares     = ceilTo(netWaste / 100, 2)
    items.push({ name: '4.5" Dutchlap Siding', qty: squares, unit: 'squares (100 sq ft)', note: `${roundTo(netWaste)} sq ft needed (+10% waste) — ${roundTo(linFt)} lin ft` })
  }

  if (product === 'hardie-lap') {
    // Hardie 8-1/4" Lap: 12-ft planks, 8.25" exposure
    const exposureFt    = HARDIE_LAP_EXPOSURE_IN / 12
    const sqFtPerPlank  = HARDIE_LAP_LENGTH_FT * exposureFt   // 8.25 sq ft per plank
    const planks        = ceilTo(netWaste / sqFtPerPlank)
    const squares       = ceilTo(netWaste / 100, 2)
    items.push({ name: 'Hardie 8-1/4" Lap Siding (12′ planks)', qty: planks, unit: 'planks', note: `${roundTo(netWaste)} sq ft needed (+10% waste) — ${squares} squares` })
  }

  if (product === 'hardie-sheet') {
    const coverage = HARDIE_SHEET_SQFT[sheetSize]
    const sheets   = ceilTo(netWaste / coverage)
    items.push({ name: `Hardie Sheet Siding (${sheetSize})`, qty: sheets, unit: 'sheets', note: `${roundTo(netWaste)} sq ft needed (+10% waste) — ${coverage} sq ft/sheet` })
  }

  return items
}
