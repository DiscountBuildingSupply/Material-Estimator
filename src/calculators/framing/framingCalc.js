import { toNum, ceilTo, roundTo } from '../../utils/math.js'
import { WASTE_FACTOR, SHEATHING_SHEET_SQFT, JOIST_BOARD_LEN_FT } from '../../utils/constants.js'

export function calcFraming(inputs) {
  const walls       = inputs.walls || []
  const wallHeight  = toNum(inputs.wallHeight)
  const spacing     = toNum(inputs.spacing, 16)
  const floorWidth  = toNum(inputs.floor?.width)
  const floorLength = toNum(inputs.floor?.length)
  const roofSpan    = toNum(inputs.roof?.span)
  const roofLength  = toNum(inputs.roof?.length)
  const roofPitch   = toNum(inputs.roof?.pitch)

  const items = []
  const spacingFt = spacing / 12

  // --- Walls ---
  const validWalls = walls.map(w => toNum(w.length)).filter(l => l > 0)
  if (validWalls.length > 0 && wallHeight > 0) {
    let totalStuds  = 0
    let totalPlates = 0
    validWalls.forEach(len => {
      totalStuds  += ceilTo(len / spacingFt) + 1
      totalPlates += ceilTo(len / JOIST_BOARD_LEN_FT) * 3
    })

    const wallSummary = validWalls.length === 1
      ? `${validWalls[0]}′ wall`
      : `${validWalls.length} walls (${validWalls.map(l => l + '′').join(', ')})`

    items.push({ name: `Wall Studs (2×4, ${wallHeight}′)`, qty: totalStuds, unit: 'pieces', note: `${wallSummary} at ${spacing}" OC` })
    items.push({ name: 'Wall Plates (16′ boards)', qty: totalPlates, unit: 'boards', note: '3 plates per wall (2 bottom, 1 top)' })
  }

  // --- Floor ---
  if (floorWidth > 0 && floorLength > 0) {
    const joistCount      = ceilTo(floorLength / spacingFt) + 1
    const sheathingSheets = ceilTo((floorWidth * floorLength) / SHEATHING_SHEET_SQFT)
    const sheathingWaste  = ceilTo(sheathingSheets * WASTE_FACTOR)

    items.push({ name: `Floor Joists (${spacing}" OC)`, qty: joistCount, unit: 'pieces', note: `Span: ${floorWidth}′, covering ${floorLength}′ run` })
    items.push({ name: 'Subfloor Sheathing (4×8)', qty: sheathingWaste, unit: 'sheets', note: `${floorWidth}′ × ${floorLength}′ = ${roundTo(floorWidth * floorLength)} sq ft (+10% waste)` })
  }

  // --- Roof ---
  if (roofSpan > 0 && roofLength > 0 && roofPitch > 0) {
    const pitchFactor   = Math.sqrt(1 + Math.pow(roofPitch / 12, 2))
    const rafterLength  = roundTo((roofSpan / 2) * pitchFactor + 1.5)
    const rafterCount   = ceilTo(roofLength / spacingFt) * 2
    const roofSqFt      = roundTo((roofSpan / 2) * pitchFactor * roofLength * 2)
    const roofSheathing = ceilTo(roofSqFt / SHEATHING_SHEET_SQFT * WASTE_FACTOR)

    items.push({ name: `Rafters (${spacing}" OC)`, qty: rafterCount, unit: 'pieces', note: `~${rafterLength}′ each, both sides` })
    items.push({ name: 'Ridge Board', qty: ceilTo(roofLength / JOIST_BOARD_LEN_FT), unit: 'boards', note: `${roofLength}′ ridge length` })
    items.push({ name: 'Roof Sheathing (4×8)', qty: roofSheathing, unit: 'sheets', note: `${roofSqFt} sq ft roof surface (+10% waste)` })
  }

  return items
}
