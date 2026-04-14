import { toNum, ceilTo, roundTo } from '../../utils/math.js'

// Weight in lbs per cubic yard for each material
export const MATERIAL_WEIGHTS = {
  'mulch-hardwood': { label: 'Hardwood Mulch',   lbsPerCuYd: 600  },
  'mulch-pine':     { label: 'Pine/Cedar Mulch',  lbsPerCuYd: 400  },
  'pea-gravel':     { label: 'Pea Gravel',         lbsPerCuYd: 2700 },
  'river-rock':     { label: 'River Rock',          lbsPerCuYd: 2800 },
  'crushed-stone':  { label: 'Crushed Stone',       lbsPerCuYd: 2900 },
}

const HALF_TON_LBS = 1000   // half-ton = 1,000 lbs

export function calcLandscaping(inputs) {
  const areas    = inputs.areas    || []
  const depthIn  = toNum(inputs.depth)          // depth in inches
  const material = inputs.material || 'mulch-hardwood'

  if (depthIn <= 0 || areas.length === 0) return []

  const depthFt   = depthIn / 12
  const matInfo   = MATERIAL_WEIGHTS[material] || MATERIAL_WEIGHTS['mulch-hardwood']

  let totalCuFt = 0
  const areaBreakdown = []

  areas.forEach((area, i) => {
    let sqFt = 0
    let desc = ''

    if (area.shape === 'circle') {
      const diameter = toNum(area.diameter)
      if (diameter <= 0) return
      const radius = diameter / 2
      sqFt = Math.PI * radius * radius
      desc = `Area ${i + 1}: ⌀${diameter}′ circle`
    } else {
      const length = toNum(area.length)
      const width  = toNum(area.width)
      if (length <= 0 || width <= 0) return
      sqFt = length * width
      desc = `Area ${i + 1}: ${length}′ × ${width}′`
    }

    const cuFt = sqFt * depthFt
    totalCuFt += cuFt
    areaBreakdown.push({ desc, sqFt: roundTo(sqFt), cuFt: roundTo(cuFt) })
  })

  if (totalCuFt <= 0 || areaBreakdown.length === 0) return []

  const totalCuYd   = roundTo(totalCuFt / 27)
  const totalLbs    = roundTo((totalCuFt / 27) * matInfo.lbsPerCuYd)
  const halfTons    = ceilTo(totalLbs / HALF_TON_LBS, 1)

  const items = []

  // Per-area breakdown if more than one area
  if (areaBreakdown.length > 1) {
    areaBreakdown.forEach(a => {
      items.push({ name: a.desc, qty: a.sqFt, unit: 'sq ft', note: `${a.cuFt} cu ft at ${depthIn}" depth` })
    })
  }

  items.push({ name: 'Total Coverage Area', qty: roundTo(areaBreakdown.reduce((s, a) => s + a.sqFt, 0)), unit: 'sq ft', note: `${depthIn}" depth → ${totalCuYd} cu yd` })
  items.push({ name: `${matInfo.label} (scooped)`, qty: halfTons, unit: 'half-tons', note: `~${totalLbs.toLocaleString()} lbs total (${matInfo.lbsPerCuYd.toLocaleString()} lbs/cu yd)` })

  return items
}
