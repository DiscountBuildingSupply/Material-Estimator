import { toNum, ceilTo, roundTo } from '../../utils/math.js'

// Post burial depth (standard: 1/3 of total post length in ground)
const BURIAL_DEPTH_FT = 2        // 2 ft in ground
const PICKET_WIDTH_IN = 5.5      // actual width of a nominal 6" board
const RAIL_LENGTH_FT  = 16       // 2x4x16 rail boards
const CONCRETE_BAGS_PER_POST = 2 // 80 lb bags per post hole

export function calcFencing(inputs) {
  const sections    = inputs.sections   || []
  const fenceHeight = toNum(inputs.fenceHeight, 6)    // 6 or 8 ft
  const postSpacing = toNum(inputs.postSpacing, 8)    // ft between posts
  const numRuns     = toNum(inputs.numRuns, 2)        // horizontal rails per section
  const includePickets  = inputs.includePickets !== false

  const validSections = sections.map(s => toNum(s.length)).filter(l => l > 0)
  if (validSections.length === 0) return []

  const totalLength = validSections.reduce((sum, l) => sum + l, 0)

  // Posts: one at each end + one every postSpacing feet
  // Each section gets its own post count, sharing corner posts is ignored (conservative)
  let totalPosts = 0
  validSections.forEach(len => {
    totalPosts += ceilTo(len / postSpacing) + 1
  })

  // Post size based on fence height (2 ft burial + fence height)
  const postLengthFt  = fenceHeight + BURIAL_DEPTH_FT
  const postLabel     = `4×4×${postLengthFt}′ PT Post`

  // Rails: 2x4x16 running the full length, one per run
  const totalRailLinFt  = totalLength * numRuns
  const railBoards      = ceilTo(totalRailLinFt / RAIL_LENGTH_FT)

  // Pickets: 1×6 dog-ear PT, 5.5" actual width, height matches fence
  const pickets = ceilTo((totalLength * 12) / PICKET_WIDTH_IN)
  const picketLabel = `1×6×${fenceHeight}′ PT Dog-Ear Picket`

  // Concrete for post setting
  const concreteBags = totalPosts * CONCRETE_BAGS_PER_POST

  const items = [
    {
      name: 'Total Fence Length',
      qty: roundTo(totalLength),
      unit: 'lin ft',
      note: validSections.length > 1
        ? validSections.map((l, i) => `Section ${i + 1}: ${l}′`).join(', ')
        : `${validSections[0]}′ run`,
    },
    {
      name: postLabel,
      qty: totalPosts,
      unit: 'posts',
      note: `1 post every ${postSpacing}′ + end posts, ${postLengthFt}′ total (${BURIAL_DEPTH_FT}′ burial)`,
    },
    {
      name: '2×4×16′ PT Rails',
      qty: railBoards,
      unit: 'boards',
      note: `${numRuns} run${numRuns !== 1 ? 's' : ''} × ${roundTo(totalLength)}′ = ${roundTo(totalRailLinFt)} lin ft`,
    },
  ]

  if (includePickets) {
    items.push({
      name: picketLabel,
      qty: pickets,
      unit: 'pickets',
      note: `5.5" actual width, no gap (privacy fence)`,
    })
  }

  items.push({
    name: 'Concrete (80 lb bags)',
    qty: concreteBags,
    unit: 'bags',
    note: `${CONCRETE_BAGS_PER_POST} bags per post × ${totalPosts} posts`,
  })

  return items
}
