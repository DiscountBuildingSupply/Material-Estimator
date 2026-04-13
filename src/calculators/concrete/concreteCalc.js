import { toNum, ceilTo, roundTo } from '../../utils/math.js'
import { CONCRETE_BAG_CUFT, REBAR_STICK_FT, BLOCK_FACE_SQFT, MORTAR_PER_BLOCK } from '../../utils/constants.js'

export function calcConcrete(inputs) {
  const subType       = inputs.subType || 'slab'
  const length        = toNum(inputs.length)
  const width         = toNum(inputs.width)
  const thickness     = toNum(inputs.thickness)   // inches (slab)
  const depth         = toNum(inputs.depth)        // feet (footing)
  const height        = toNum(inputs.height)       // feet (block wall)
  const rebarSpacing  = toNum(inputs.rebarSpacing, 12)  // inches

  const items = []

  if (length <= 0) return items

  if (subType === 'slab') {
    if (width <= 0 || thickness <= 0) return items
    const volumeCuFt  = length * width * (thickness / 12)
    const volumeCuYd  = roundTo(volumeCuFt / 27)
    const bags80lb    = ceilTo(volumeCuFt / CONCRETE_BAG_CUFT)

    items.push({ name: 'Concrete (ready-mix)', qty: volumeCuYd, unit: 'cu yd', note: `${length}′ × ${width}′ × ${thickness}"` })
    items.push({ name: 'Concrete (80 lb bags, alt)', qty: bags80lb, unit: 'bags', note: `Alternative to ready-mix (~0.60 cu ft/bag)` })

    if (rebarSpacing > 0) {
      const spacingFt      = rebarSpacing / 12
      const barsAlongWidth  = ceilTo(width  / spacingFt) + 1
      const barsAlongLength = ceilTo(length / spacingFt) + 1
      const totalLinFt      = (barsAlongWidth * length) + (barsAlongLength * width)
      const rebarSticks     = ceilTo(totalLinFt / REBAR_STICK_FT)
      items.push({ name: `Rebar (${rebarSpacing}" grid)`, qty: rebarSticks, unit: '20-ft sticks', note: `${roundTo(totalLinFt)} linear ft total` })
    }
  }

  if (subType === 'footing') {
    if (width <= 0 || depth <= 0) return items
    const volumeCuFt = length * width * depth
    const volumeCuYd = roundTo(volumeCuFt / 27)
    const bags80lb   = ceilTo(volumeCuFt / CONCRETE_BAG_CUFT)

    items.push({ name: 'Concrete (ready-mix)', qty: volumeCuYd, unit: 'cu yd', note: `${length}′ × ${width}′ × ${depth}′ deep` })
    items.push({ name: 'Concrete (80 lb bags, alt)', qty: bags80lb, unit: 'bags', note: 'Alternative to ready-mix' })

    if (rebarSpacing > 0) {
      const rebarRuns   = ceilTo(width / (rebarSpacing / 12)) + 1
      const totalLinFt  = rebarRuns * length
      const rebarSticks = ceilTo(totalLinFt / REBAR_STICK_FT)
      items.push({ name: 'Rebar (longitudinal)', qty: rebarSticks, unit: '20-ft sticks', note: `${rebarRuns} bars × ${length}′` })
    }
  }

  if (subType === 'blockWall') {
    if (height <= 0) return items
    const wallFaceArea   = length * height
    const blocksNeeded   = ceilTo(wallFaceArea / BLOCK_FACE_SQFT)
    const mortarBags     = ceilTo(blocksNeeded * MORTAR_PER_BLOCK)
    // Footing: standard = wall length × 16" wide × 8" deep
    const footingCuYd    = roundTo((length * (16 / 12) * (8 / 12)) / 27)

    items.push({ name: 'CMU Blocks (8×8×16)', qty: blocksNeeded, unit: 'blocks', note: `${length}′ × ${height}′ wall = ${roundTo(wallFaceArea)} sq ft face` })
    items.push({ name: 'Mortar (60 lb bags)', qty: mortarBags, unit: 'bags', note: `~0.25 bags per block` })
    items.push({ name: 'Footing Concrete', qty: footingCuYd, unit: 'cu yd', note: `16" wide × 8" deep continuous footing` })
  }

  return items
}
