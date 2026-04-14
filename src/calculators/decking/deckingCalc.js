import { toNum, ceilTo, roundTo } from '../../utils/math.js'

const TREX_BOARD_WIDTH_IN    = 5.5
const JOIST_DEPTH_FT         = 0.67
const BEAM_DEPTH_FT          = 0.83
const BURIAL_DEPTH_FT        = 2
const MAX_BEAM_SPAN_FT       = 8
const CONCRETE_BAGS_PER_POST = 2
const POST_STANDARD_LENGTHS  = [6, 8, 10, 12, 14]

const STOCK_LENGTHS = [8, 10, 12, 14, 16, 18, 20, 22, 24]  // available 2× stock

const DECK_SCREWS_PER_SQFT = 2 / (TREX_BOARD_WIDTH_IN / 12)
const SCREWS_PER_LB        = 200

// For a member that must be a single uncut piece (e.g. joist spanning full width):
// pick shortest available stock >= span.
function singleStock(spanFt) {
  return STOCK_LENGTHS.find(l => l >= spanFt) || 24
}

// For a run that can be pieced end-to-end (beams, rim joists, ledger):
// find the stock length that yields the fewest boards with the least waste.
function boardsForRun(runFt) {
  // If a single board covers it, use the shortest that fits
  const single = STOCK_LENGTHS.find(l => l >= runFt)
  if (single) return { count: 1, stockLength: single }

  // Otherwise try every stock length and pick lowest waste
  let best = { count: Infinity, stockLength: 16, waste: Infinity }
  for (const len of STOCK_LENGTHS) {
    const count = ceilTo(runFt / len)
    const waste = (count * len) - runFt
    if (waste < best.waste || (waste === best.waste && count < best.count)) {
      best = { count, stockLength: len, waste }
    }
  }
  return best
}

export function calcDecking(inputs) {
  const deckLength     = toNum(inputs.deckLength)
  const deckWidth      = toNum(inputs.deckWidth)
  const deckHeight     = toNum(inputs.deckHeight, 2)
  const postSpacing    = toNum(inputs.postSpacing, 8)
  const joistSpacing   = toNum(inputs.joistSpacing, 16)
  const boardLength    = toNum(inputs.boardLength, 16)
  const attachedToHouse = inputs.attachedToHouse !== false

  if (deckLength <= 0 || deckWidth <= 0) return []

  const deckArea       = deckLength * deckWidth
  const joistSpacingFt = joistSpacing / 12

  // ── Posts ─────────────────────────────────────────────────────────────────────
  const beamRowCount = attachedToHouse
    ? ceilTo(deckWidth / MAX_BEAM_SPAN_FT)
    : ceilTo(deckWidth / MAX_BEAM_SPAN_FT) + 1

  const postsPerRow  = ceilTo(deckLength / postSpacing) + 1
  const totalPosts   = postsPerRow * beamRowCount

  const postNeededFt = BURIAL_DEPTH_FT + deckHeight + BEAM_DEPTH_FT + JOIST_DEPTH_FT
  const postLength   = POST_STANDARD_LENGTHS.find(l => l >= postNeededFt) || 14

  // ── Beams (doubled 2×10 PT) ───────────────────────────────────────────────────
  const beamStock     = boardsForRun(deckLength)
  // Each beam row needs 2 boards (doubled); beamRowCount rows total
  const beamBoards    = beamRowCount * 2 * beamStock.count

  // ── Joists (2×8 PT) ──────────────────────────────────────────────────────────
  // Each joist spans the full deckWidth as a single piece
  const joistCount      = ceilTo(deckLength / joistSpacingFt) + 1
  const joistStockLen   = singleStock(deckWidth)
  // joistCount boards, each one piece of joistStockLen
  const joistBoards     = joistCount

  // ── Rim Joists (2×8 PT) ───────────────────────────────────────────────────────
  // Side rims: 2 pieces each spanning deckWidth (single boards)
  const sideRimStock  = singleStock(deckWidth)
  const sideRimBoards = 2   // one per side, always 2 sides

  // Long rim(s): outer face always; inner face only if freestanding
  const longRimStock  = boardsForRun(deckLength)
  const longRimRows   = attachedToHouse ? 1 : 2   // ledger replaces inner long rim
  const longRimBoards = longRimStock.count * longRimRows

  const totalRimBoards = sideRimBoards + longRimBoards

  // ── Ledger (2×10 PT, attached only) ──────────────────────────────────────────
  const ledgerStock  = boardsForRun(deckLength)
  const ledgerBoards = attachedToHouse ? ledgerStock.count : 0

  // ── Trex Composite Decking ────────────────────────────────────────────────────
  const trexRows     = ceilTo((deckWidth * 12) / TREX_BOARD_WIDTH_IN)
  const boardsPerRow = ceilTo(deckLength / boardLength)
  const trexBoards   = ceilTo(trexRows * boardsPerRow * 1.10)

  // ── Screws ────────────────────────────────────────────────────────────────────
  const deckScrewLbs    = ceilTo((deckArea * DECK_SCREWS_PER_SQFT) / SCREWS_PER_LB)
  const framingScrewLbs = ceilTo(deckArea / 25)

  // ── Joist Hangers ─────────────────────────────────────────────────────────────
  const joistHangers = joistCount * 2   // 2 per joist — one at each end

  // ── Concrete ──────────────────────────────────────────────────────────────────
  const concreteBags = totalPosts * CONCRETE_BAGS_PER_POST

  return [
    {
      name: 'Deck Area',
      qty: roundTo(deckArea), unit: 'sq ft',
      note: `${deckLength}′ × ${deckWidth}′`,
    },
    {
      name: `Trex Composite Decking (${boardLength}′ boards)`,
      qty: trexBoards, unit: 'boards',
      note: `${trexRows} rows × ${boardsPerRow} boards/row (+10% waste)`,
    },
    {
      name: `6×6×${postLength}′ PT Posts`,
      qty: totalPosts, unit: 'posts',
      note: `${postsPerRow} posts/row × ${beamRowCount} beam row${beamRowCount > 1 ? 's' : ''}`,
    },
    {
      name: `2×10×${beamStock.stockLength}′ PT Beam Stock (doubled)`,
      qty: beamBoards, unit: 'boards',
      note: `${beamRowCount} row${beamRowCount > 1 ? 's' : ''} × 2 boards each — ${beamStock.count} board${beamStock.count > 1 ? 's' : ''} per row covers ${deckLength}′`,
    },
    {
      name: `2×8×${joistStockLen}′ PT Joists (${joistSpacing}" OC)`,
      qty: joistBoards, unit: 'boards',
      note: `${joistCount} joists spanning ${deckWidth}′`,
    },
    {
      name: '2×8 PT Rim Joists',
      qty: totalRimBoards, unit: 'boards',
      note: `2× ${sideRimStock}′ sides + ${longRimStock.count * longRimRows}× ${longRimStock.stockLength}′ long ${attachedToHouse ? 'outer rim' : 'rims'}`,
    },
    ...(attachedToHouse ? [{
      name: `2×10×${ledgerStock.stockLength}′ PT Ledger Board`,
      qty: ledgerBoards, unit: 'boards',
      note: `${deckLength}′ along house`,
    }] : []),
    {
      name: '2×8 Joist Hangers',
      qty: joistHangers, unit: 'hangers',
      note: `${joistCount} joists × 2 ends`,
    },
    {
      name: 'Composite Deck Screws (2.5")',
      qty: deckScrewLbs, unit: 'lbs',
      note: `~${SCREWS_PER_LB} screws/lb, 2 per board per joist`,
    },
    {
      name: 'Structural Framing Screws',
      qty: framingScrewLbs, unit: 'lbs',
      note: 'For joist hangers, ledger, rim joists',
    },
    {
      name: 'Post Base Hardware',
      qty: totalPosts, unit: 'bases',
      note: '1 per post',
    },
    {
      name: 'Concrete (80 lb bags)',
      qty: concreteBags, unit: 'bags',
      note: `${CONCRETE_BAGS_PER_POST} bags per post`,
    },
  ]
}
