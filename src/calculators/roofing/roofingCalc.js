import { toNum, ceilTo, roundTo } from '../../utils/math.js'
import {
  WASTE_FACTOR,
  SHINGLE_BUNDLE_SQFT,
  UNDERLAYMENT_ROLL_SQFT,
  ICE_SHIELD_ROLL_SQFT,
  RIDGE_CAP_LF_PER_BUNDLE,
  NAILS_PER_SQUARE,
  NAILS_PER_LB_BOX,
} from '../../utils/constants.js'

export function calcRoofing(inputs) {
  const ridgeLength      = toNum(inputs.ridgeLength)
  const roofWidth        = toNum(inputs.roofWidth)    // rafter run (one side), ft
  const pitch            = toNum(inputs.pitch)
  const iceShieldRows    = toNum(inputs.iceShieldRows, 2)
  const underlaymentType = inputs.underlaymentType || '15lb'

  if (ridgeLength <= 0 || roofWidth <= 0 || pitch <= 0) return []

  const pitchFactor     = Math.sqrt(1 + Math.pow(pitch / 12, 2))
  const totalSqFt       = roundTo(ridgeLength * roofWidth * pitchFactor * 2)
  const roofingSquares  = totalSqFt / 100
  const sqWithWaste     = roofingSquares * WASTE_FACTOR

  const bundlesNeeded      = ceilTo(sqWithWaste * 3)   // 3 bundles per square
  const squaresNeeded      = ceilTo(sqWithWaste)
  const rollSqFt           = UNDERLAYMENT_ROLL_SQFT[underlaymentType]
  const underlayRolls      = ceilTo(totalSqFt / rollSqFt)
  const iceShieldSqFt      = iceShieldRows * ridgeLength * 3   // 3 ft wide per row
  const iceShieldRolls     = ceilTo(iceShieldSqFt / ICE_SHIELD_ROLL_SQFT)
  const ridgeCapBundles    = ceilTo(ridgeLength / RIDGE_CAP_LF_PER_BUNDLE)
  const nailBoxes          = ceilTo(roofingSquares * NAILS_PER_SQUARE / NAILS_PER_LB_BOX)

  return [
    { name: 'Roof Area', qty: totalSqFt, unit: 'sq ft', note: `${roundTo(roofingSquares, 1)} squares total` },
    { name: 'Shingles (3-tab / architectural)', qty: bundlesNeeded, unit: 'bundles', note: `${squaresNeeded} squares (+10% waste)` },
    { name: `Underlayment (${underlaymentType} felt)`, qty: underlayRolls, unit: 'rolls', note: `${rollSqFt} sq ft per roll` },
    { name: 'Ice & Water Shield', qty: iceShieldRolls, unit: 'rolls', note: `${iceShieldRows} rows × ${ridgeLength}′ eaves, 3′ wide` },
    { name: 'Ridge Cap Shingles', qty: ridgeCapBundles, unit: 'bundles', note: `${ridgeLength}′ ridge length` },
    { name: 'Roofing Nails (1 lb box)', qty: nailBoxes, unit: 'boxes', note: `~${NAILS_PER_SQUARE} nails per square` },
  ]
}
