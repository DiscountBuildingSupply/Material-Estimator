import { toNum, ceilTo, roundTo } from '../../utils/math.js'
import {
  WASTE_FACTOR,
  DRYWALL_SHEET_SQFT,
  MUD_SQFT_PER_GALLON,
  MUD_BUCKET_GALLONS,
  TAPE_SQFT_PER_ROLL,
  SCREW_SQFT_PER_LB,
  DOOR_SQFT,
  WINDOW_SQFT,
  BATT_OPTIONS,
} from '../../utils/constants.js'

export function calcDrywall(inputs) {
  const roomLength         = toNum(inputs.roomLength)
  const roomWidth          = toNum(inputs.roomWidth)
  const ceilingHeight      = toNum(inputs.ceilingHeight, 8)
  const numDoors           = toNum(inputs.numDoors, 0)
  const numWindows         = toNum(inputs.numWindows, 0)
  const insulationType     = inputs.insulationType || 'batt'
  const battR              = inputs.battR || 'R-13'
  const battSizeIdx        = toNum(inputs.battSizeIdx, 0)
  const ceilingInsulationR = toNum(inputs.ceilingInsulationR, 38)

  if (roomLength <= 0 || roomWidth <= 0) return []

  const perimeter       = 2 * (roomLength + roomWidth)
  const grossWallArea   = perimeter * ceilingHeight
  const openingDeduct   = (numDoors * DOOR_SQFT) + (numWindows * WINDOW_SQFT)
  const netWallArea     = Math.max(0, grossWallArea - openingDeduct)
  const ceilingArea     = roomLength * roomWidth
  const totalArea       = netWallArea + ceilingArea

  const sheetsRaw     = totalArea / DRYWALL_SHEET_SQFT
  const sheetsWaste   = ceilTo(sheetsRaw * WASTE_FACTOR)
  const mudGallons    = ceilTo(totalArea / MUD_SQFT_PER_GALLON)
  const mudBuckets    = ceilTo(mudGallons / MUD_BUCKET_GALLONS)
  const tapeRolls     = ceilTo(totalArea / TAPE_SQFT_PER_ROLL)
  const screwLbs      = ceilTo(totalArea / SCREW_SQFT_PER_LB)

  const items = [
    { name: 'Drywall Sheets (4×8)', qty: sheetsWaste, unit: 'sheets', note: `${roundTo(totalArea)} sq ft total (+10% waste)` },
    { name: 'Joint Compound (3.5 gal bucket)', qty: mudBuckets, unit: 'buckets', note: `${mudGallons} gal needed` },
    { name: 'Drywall Tape', qty: tapeRolls, unit: 'rolls', note: `~500 sq ft coverage per roll` },
    { name: 'Drywall Screws (1 lb box)', qty: screwLbs, unit: 'boxes', note: `~1 lb per 150 sq ft` },
  ]

  // Insulation
  if (insulationType === 'batt' && netWallArea > 0) {
    const sizes    = BATT_OPTIONS[battR] || BATT_OPTIONS['R-13']
    const size     = sizes[Math.min(battSizeIdx, sizes.length - 1)]
    const packs    = ceilTo(netWallArea / size.coverage)
    items.push({ name: `Batt Insulation (${battR})`, qty: packs, unit: 'packs', note: `${size.label} — ${roundTo(netWallArea)} sq ft wall area` })
  }

  if (insulationType === 'blown' && ceilingArea > 0) {
    // ~1 bag per 40 sq ft at R-38; scale by R-value
    const blownBags = ceilTo(ceilingArea / (40 * (38 / Math.max(ceilingInsulationR, 1))))
    items.push({ name: `Blown-In Insulation (R-${ceilingInsulationR})`, qty: blownBags, unit: 'bags', note: `Ceiling: ${roundTo(ceilingArea)} sq ft — verify bag coverage chart` })
  }

  if (insulationType === 'rigid' && netWallArea > 0) {
    const rigidSheets = ceilTo(netWallArea / DRYWALL_SHEET_SQFT * WASTE_FACTOR)
    items.push({ name: 'Rigid Foam Insulation (4×8)', qty: rigidSheets, unit: 'sheets', note: `Wall area: ${roundTo(netWallArea)} sq ft (+10% waste)` })
  }

  return items
}
