import { toNum, ceilTo, roundTo } from '../../utils/math.js'
import { WASTE_FACTOR, SHEATHING_SHEET_SQFT, JOIST_BOARD_LEN_FT } from '../../utils/constants.js'

export function calcFraming(inputs) {
  const wallLength  = toNum(inputs.wallLength)
  const wallHeight  = toNum(inputs.wallHeight)
  const numWalls    = toNum(inputs.numWalls, 1)
  const spacing     = toNum(inputs.spacing, 16)
  const floorWidth  = toNum(inputs.floorWidth)
  const floorLength = toNum(inputs.floorLength)
  const roofSpan    = toNum(inputs.roofSpan)
  const roofLength  = toNum(inputs.roofLength)
  const roofPitch   = toNum(inputs.roofPitch)

  const items = []
  const spacingFt = spacing / 12

  // --- Walls ---
  if (wallLength > 0 && wallHeight > 0 && numWalls > 0) {
    const studsPerWall = ceilTo(wallLength / spacingFt) + 1
    const totalStuds   = studsPerWall * numWalls
    // 3 plates per wall (2 bottom, 1 top), each plate = wallLength ft, bought in 16-ft boards
    const platesPerWall  = ceilTo(wallLength / JOIST_BOARD_LEN_FT) * 3
    const totalPlates    = platesPerWall * numWalls

    items.push({ name: `Wall Studs (2×4, ${wallHeight}′)`, qty: totalStuds, unit: 'pieces', note: `${studsPerWall} per wall × ${numWalls} walls at ${spacing}" OC` })
    items.push({ name: 'Wall Plates (16′ boards)', qty: totalPlates, unit: 'boards', note: '3 plates per wall (2 bottom, 1 top)' })
  }

  // --- Floor ---
  if (floorWidth > 0 && floorLength > 0) {
    const joistCount     = ceilTo(floorLength / spacingFt) + 1
    const sheathingSheets = ceilTo((floorWidth * floorLength) / SHEATHING_SHEET_SQFT)
    const sheathingWaste  = ceilTo(sheathingSheets * WASTE_FACTOR)

    items.push({ name: `Floor Joists (${spacing}" OC)`, qty: joistCount, unit: 'pieces', note: `Span: ${floorWidth}′, covering ${floorLength}′ run` })
    items.push({ name: 'Subfloor Sheathing (4×8)', qty: sheathingWaste, unit: 'sheets', note: `${floorWidth}′ × ${floorLength}′ = ${roundTo(floorWidth * floorLength)} sq ft (+10% waste)` })
  }

  // --- Roof ---
  if (roofSpan > 0 && roofLength > 0 && roofPitch > 0) {
    const pitchFactor   = Math.sqrt(1 + Math.pow(roofPitch / 12, 2))
    const rafterLength  = roundTo((roofSpan / 2) * pitchFactor + 1.5)  // +1.5 ft overhang
    const rafterCount   = ceilTo(roofLength / spacingFt) * 2            // both sides
    const roofSqFt      = roundTo((roofSpan / 2) * pitchFactor * roofLength * 2)
    const roofSheathing = ceilTo(roofSqFt / SHEATHING_SHEET_SQFT * WASTE_FACTOR)
    const ridgeLengthFt = roofLength

    items.push({ name: `Rafters (${spacing}" OC)`, qty: rafterCount, unit: 'pieces', note: `~${rafterLength}′ each, both sides` })
    items.push({ name: `Ridge Board`, qty: ceilTo(ridgeLengthFt / JOIST_BOARD_LEN_FT), unit: 'boards', note: `${ridgeLengthFt}′ ridge length` })
    items.push({ name: 'Roof Sheathing (4×8)', qty: roofSheathing, unit: 'sheets', note: `${roofSqFt} sq ft roof surface (+10% waste)` })
  }

  return items
}
