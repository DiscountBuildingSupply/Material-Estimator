import { toNum, ceilTo, roundTo } from '../../utils/math.js'
import { CONCRETE_BAG_CUFT, REBAR_STICK_FT, BLOCK_FACE_SQFT, MORTAR_PER_BLOCK } from '../../utils/constants.js'

// Type S mortar ratio (by volume): 1 Portland : 0.5 lime : 4.5 sand
// Per 1 cu ft of mortar:
const TYPE_S_PORTLAND_PER_CUFT = 1 / 6         // bags (94 lb ≈ 1 cu ft)
const TYPE_S_LIME_PER_CUFT     = 0.5 / 6       // bags (50 lb ≈ 1 cu ft)
const TYPE_S_SAND_PER_CUFT     = 4.5 / 6       // cu ft of mason sand per cu ft mortar
const SAND_LBS_PER_CUFT        = 100            // ~100 lbs per cu ft mason sand
const SAND_BAG_LBS             = 60             // 60 lb bags of mason sand

// Coosa Type S pre-blended bag (75 lb): ~0.56 cu ft yield per bag
const COOSA_BAG_CUFT           = 0.56
// Mortar sand sold by half-ton (1,000 lbs); sand ≈ 100 lbs/cu ft → 10 cu ft/half-ton
const MORTAR_SAND_LBS_PER_HALF_TON = 1000
const MORTAR_SAND_LBS_PER_CUFT    = 100

// CMU mortar volume: ~0.03 cu ft per block face (8×8×16 at 3/8" joints)
const MORTAR_CUFT_PER_BLOCK    = 0.03

// Site-mix concrete ratio 1:2:3 (cement:sand:gravel by volume), yield ~4.5 cu ft per bag
const SITE_MIX_CEMENT_PER_CUFT  = 1 / 4.5      // bags (94 lb) per cu ft concrete
const SITE_MIX_SAND_PER_CUFT    = 2 / 4.5      // cu ft sand per cu ft concrete
const SITE_MIX_GRAVEL_PER_CUFT  = 3 / 4.5      // cu ft gravel per cu ft concrete
const GRAVEL_BAG_CUFT           = 0.5           // 50 lb bag ≈ 0.5 cu ft gravel

export function calcConcrete(inputs) {
  const subType       = inputs.subType || 'slab'
  const length        = toNum(inputs.length)
  const width         = toNum(inputs.width)
  const thickness     = toNum(inputs.thickness)
  const depth         = toNum(inputs.depth)
  const height        = toNum(inputs.height)
  const rebarSpacing  = toNum(inputs.rebarSpacing, 12)
  const mortarApp     = inputs.mortarApp    || 'blockWall'
  const mortarMethod  = inputs.mortarMethod || 'scratch'

  const items = []

  if (length <= 0) return items

  // ── Concrete Slab ───────────────────────────────────────────────────────────
  if (subType === 'slab') {
    if (width <= 0 || thickness <= 0) return items
    const volumeCuFt = length * width * (thickness / 12)
    const volumeCuYd = roundTo(volumeCuFt / 27)
    const bags80lb   = ceilTo(volumeCuFt / CONCRETE_BAG_CUFT)

    items.push({ name: 'Concrete (ready-mix)', qty: volumeCuYd, unit: 'cu yd', note: `${length}′ × ${width}′ × ${thickness}"` })
    items.push({ name: 'Concrete (80 lb bags, alt)', qty: bags80lb, unit: 'bags', note: 'Alternative to ready-mix (~0.60 cu ft/bag)' })

    if (rebarSpacing > 0) {
      const spacingFt       = rebarSpacing / 12
      const barsAlongWidth  = ceilTo(width  / spacingFt) + 1
      const barsAlongLength = ceilTo(length / spacingFt) + 1
      const totalLinFt      = (barsAlongWidth * length) + (barsAlongLength * width)
      items.push({ name: `Rebar (${rebarSpacing}" grid)`, qty: ceilTo(totalLinFt / REBAR_STICK_FT), unit: '20-ft sticks', note: `${roundTo(totalLinFt)} linear ft total` })
    }
  }

  // ── Strip Footing ────────────────────────────────────────────────────────────
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
      items.push({ name: 'Rebar (longitudinal)', qty: ceilTo(totalLinFt / REBAR_STICK_FT), unit: '20-ft sticks', note: `${rebarRuns} bars × ${length}′` })
    }
  }

  // ── CMU Block Wall ───────────────────────────────────────────────────────────
  if (subType === 'blockWall') {
    if (height <= 0) return items
    const wallFaceArea = length * height
    const blocksNeeded = ceilTo(wallFaceArea / BLOCK_FACE_SQFT)
    const mortarBags   = ceilTo(blocksNeeded * MORTAR_PER_BLOCK)
    const footingCuYd  = roundTo((length * (16 / 12) * (8 / 12)) / 27)

    items.push({ name: 'CMU Blocks (8×8×16)', qty: blocksNeeded, unit: 'blocks', note: `${length}′ × ${height}′ wall = ${roundTo(wallFaceArea)} sq ft face` })
    items.push({ name: 'Mortar (60 lb bags)', qty: mortarBags, unit: 'bags', note: '~0.25 bags per block' })
    items.push({ name: 'Footing Concrete', qty: footingCuYd, unit: 'cu yd', note: '16" wide × 8" deep continuous footing' })
  }

  // ── Type S Mortar (from scratch) ─────────────────────────────────────────────
  if (subType === 'typeSMortar') {
    if (height <= 0 && toNum(inputs.area) <= 0) return items

    let mortarCuFt
    let areaNote

    if (mortarApp === 'blockWall') {
      // Estimate area from length × height, then mortar vol from block count
      if (height <= 0) return items
      const wallArea    = length * height
      const blockCount  = ceilTo(wallArea / BLOCK_FACE_SQFT)
      mortarCuFt        = blockCount * MORTAR_CUFT_PER_BLOCK
      areaNote          = `${length}′ × ${height}′ wall, ~${blockCount} blocks`
    } else {
      // Stone / brick / pointing: ~0.5 cu ft mortar per sq ft of wall face
      if (height <= 0) return items
      const wallArea = length * height
      mortarCuFt     = wallArea * 0.5
      areaNote       = `${length}′ × ${height}′ = ${roundTo(wallArea)} sq ft wall face`
    }

    items.push({ name: 'Mortar Volume (estimated)', qty: roundTo(mortarCuFt), unit: 'cu ft', note: areaNote })

    if (mortarMethod === 'scratch') {
      // Portland + lime + bagged mason sand
      const portlandBags = ceilTo(mortarCuFt * TYPE_S_PORTLAND_PER_CUFT)
      const limeBags     = ceilTo(mortarCuFt * TYPE_S_LIME_PER_CUFT)
      const sandCuFt     = roundTo(mortarCuFt * TYPE_S_SAND_PER_CUFT)
      const sandBags60   = ceilTo((sandCuFt * SAND_LBS_PER_CUFT) / SAND_BAG_LBS)
      items.push({ name: 'Portland Cement (94 lb bags)', qty: portlandBags, unit: 'bags', note: 'Type S ratio: 1 part Portland' })
      items.push({ name: 'Hydrated Lime (50 lb bags)',   qty: limeBags,     unit: 'bags', note: 'Type S ratio: 0.5 part lime' })
      items.push({ name: 'Mason Sand (60 lb bags)',       qty: sandBags60,   unit: 'bags', note: `${sandCuFt} cu ft — Type S ratio: 4.5 parts sand` })
    } else {
      // Coosa Type S pre-blended + mortar sand by half-ton
      const coosaBags       = ceilTo(mortarCuFt / COOSA_BAG_CUFT)
      const sandCuFt        = roundTo(mortarCuFt * TYPE_S_SAND_PER_CUFT)
      const sandLbs         = sandCuFt * MORTAR_SAND_LBS_PER_CUFT
      const halfTons        = ceilTo(sandLbs / MORTAR_SAND_LBS_PER_HALF_TON, 1)
      items.push({ name: 'Coosa Type S (75 lb bags)',     qty: coosaBags, unit: 'bags',      note: `~${COOSA_BAG_CUFT} cu ft yield per bag` })
      items.push({ name: 'Mortar Sand (scooped)',          qty: halfTons,  unit: 'half-tons', note: `~${roundTo(sandLbs)} lbs / ${sandCuFt} cu ft needed` })
    }
  }

  // ── Site-Mixed Concrete (Portland + sand + gravel) ───────────────────────────
  if (subType === 'siteMix') {
    if (width <= 0 || thickness <= 0) return items
    const volumeCuFt    = length * width * (thickness / 12)
    const cementBags    = ceilTo(volumeCuFt * SITE_MIX_CEMENT_PER_CUFT)
    const sandCuFt      = roundTo(volumeCuFt * SITE_MIX_SAND_PER_CUFT)
    const gravelCuFt    = roundTo(volumeCuFt * SITE_MIX_GRAVEL_PER_CUFT)
    const sandBags60    = ceilTo((sandCuFt * SAND_LBS_PER_CUFT) / SAND_BAG_LBS)
    const gravelBags50  = ceilTo(gravelCuFt / GRAVEL_BAG_CUFT)

    items.push({ name: 'Concrete Volume', qty: roundTo(volumeCuFt / 27), unit: 'cu yd', note: `${length}′ × ${width}′ × ${thickness}" = ${roundTo(volumeCuFt)} cu ft` })
    items.push({ name: 'Portland Cement (94 lb bags)', qty: cementBags, unit: 'bags', note: '1:2:3 mix ratio' })
    items.push({ name: 'Sand (60 lb bags)', qty: sandBags60, unit: 'bags', note: `${sandCuFt} cu ft needed` })
    items.push({ name: 'Gravel / Aggregate (50 lb bags)', qty: gravelBags50, unit: 'bags', note: `${gravelCuFt} cu ft needed` })
  }

  return items
}
