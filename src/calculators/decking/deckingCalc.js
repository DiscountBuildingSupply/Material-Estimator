import { toNum, ceilTo, roundTo } from '../../utils/math.js'

const TREX_BOARD_WIDTH_IN   = 5.5     // actual width of nominal 6" Trex board
const JOIST_DEPTH_FT        = 0.67    // 2×8 joist = 7.25" ≈ 0.6 ft
const BEAM_DEPTH_FT         = 0.83    // 2×10 doubled beam = 9.25" ≈ 0.77 ft
const BURIAL_DEPTH_FT       = 2       // post burial depth
const MAX_JOIST_SPAN_FT     = 12      // 2×8 max unsupported span
const MAX_BEAM_SPAN_FT      = 8       // doubled 2×10 max span between posts
const CONCRETE_BAGS_PER_POST = 2      // 80 lb bags per post hole
const POST_STANDARD_LENGTHS = [6, 8, 10, 12, 14]  // available PT post lengths

// Screws: 2 per board crossing per joist; ~200 screws per lb (2.5" composite)
const DECK_SCREWS_PER_SQFT  = 2 / (TREX_BOARD_WIDTH_IN / 12)   // ≈ 4.4 per sq ft
const SCREWS_PER_LB         = 200

export function calcDecking(inputs) {
  const deckLength    = toNum(inputs.deckLength)
  const deckWidth     = toNum(inputs.deckWidth)
  const deckHeight    = toNum(inputs.deckHeight, 2)   // ft above grade
  const postSpacing   = toNum(inputs.postSpacing, 8)
  const joistSpacing  = toNum(inputs.joistSpacing, 16)  // inches
  const boardLength   = toNum(inputs.boardLength, 16)   // Trex board length in ft
  const attachedToHouse = inputs.attachedToHouse !== false

  if (deckLength <= 0 || deckWidth <= 0) return []

  const deckArea      = deckLength * deckWidth
  const joistSpacingFt = joistSpacing / 12

  // ── Posts ────────────────────────────────────────────────────────────────────
  // Beams run parallel to the house (along deckLength), spaced every MAX_BEAM_SPAN_FT
  // If attached, ledger replaces the innermost beam row
  const beamRowCount  = attachedToHouse
    ? ceilTo(deckWidth / MAX_BEAM_SPAN_FT)        // ledger handles house side
    : ceilTo(deckWidth / MAX_BEAM_SPAN_FT) + 1    // needs posts on both ends

  const postsPerRow   = ceilTo(deckLength / postSpacing) + 1
  const totalPosts    = postsPerRow * beamRowCount

  // Post length: burial + height above grade + beam + joist assembly, round up to standard
  const postNeededFt  = BURIAL_DEPTH_FT + deckHeight + BEAM_DEPTH_FT + JOIST_DEPTH_FT
  const postLength    = POST_STANDARD_LENGTHS.find(l => l >= postNeededFt) || 14

  // ── Beams (doubled 2×10 PT) ──────────────────────────────────────────────────
  // One beam per beam row; each beam = deckLength ft; doubled = 2 boards per row
  const beamBoards    = beamRowCount * 2 * ceilTo(deckLength / 16)  // cut from 16-ft stock

  // ── Joists (2×8 PT) ─────────────────────────────────────────────────────────
  // Joists span deckWidth (perpendicular to beams/house), spaced at joistSpacing
  const joistCount    = ceilTo(deckLength / joistSpacingFt) + 1
  const joistLength   = deckWidth  // each joist spans the full depth
  const joistBoards   = joistCount * ceilTo(joistLength / 16)  // 16-ft stock

  // Rim joists: 2 short sides (deckWidth each) + 1 long side if not attached
  // If attached, ledger replaces one long rim joist
  const rimLinFt      = attachedToHouse
    ? (2 * deckWidth) + deckLength           // 2 sides + outer rim
    : (2 * deckWidth) + (2 * deckLength)     // full perimeter
  const rimBoards     = ceilTo(rimLinFt / 16)

  // Ledger board (if attached to house): 2×10, full deck length
  const ledgerBoards  = attachedToHouse ? ceilTo(deckLength / 16) : 0

  // ── Trex Composite Decking ───────────────────────────────────────────────────
  // Boards run parallel to house (deckLength direction)
  // Rows = number of board widths across deckWidth
  const trexRows      = ceilTo((deckWidth * 12) / TREX_BOARD_WIDTH_IN)
  // Boards per row: deck length / board length, rounded up
  const boardsPerRow  = ceilTo(deckLength / boardLength)
  const trexBoardsNet = trexRows * boardsPerRow
  const trexBoards    = ceilTo(trexBoardsNet * 1.10)  // +10% waste

  // ── Screws ───────────────────────────────────────────────────────────────────
  // Composite deck screws: 2 per board per joist crossing
  const deckScrewLbs  = ceilTo((deckArea * DECK_SCREWS_PER_SQFT) / SCREWS_PER_LB)
  // Framing/structural screws: ~1 lb per 25 sq ft for joist hangers, ledger, etc.
  const framingScrewLbs = ceilTo(deckArea / 25)

  // ── Joist Hangers ────────────────────────────────────────────────────────────
  // 2 hangers per joist (both ends), minus ledger side if attached
  const joistsHangers = attachedToHouse ? joistCount : joistCount * 2

  // ── Concrete ─────────────────────────────────────────────────────────────────
  const concreteBags  = totalPosts * CONCRETE_BAGS_PER_POST

  return [
    { name: 'Deck Area',                           qty: roundTo(deckArea),      unit: 'sq ft',  note: `${deckLength}′ × ${deckWidth}′` },
    { name: `Trex Composite Decking (${boardLength}′ boards)`, qty: trexBoards, unit: 'boards', note: `${trexRows} rows × ${boardsPerRow} boards/row (+10% waste)` },
    { name: `6×6×${postLength}′ PT Posts`,         qty: totalPosts,             unit: 'posts',  note: `${postsPerRow} posts/row × ${beamRowCount} beam row${beamRowCount > 1 ? 's' : ''}` },
    { name: 'Doubled 2×10×16′ PT Beam Stock',      qty: beamBoards,             unit: 'boards', note: `${beamRowCount} beam row${beamRowCount > 1 ? 's' : ''}, doubled` },
    { name: `2×8 PT Joists (${joistSpacing}" OC)`, qty: joistBoards,            unit: 'boards', note: `${joistCount} joists × ${joistLength}′ span` },
    { name: '2×8 PT Rim Joists',                   qty: rimBoards,              unit: 'boards', note: `${roundTo(rimLinFt)} lin ft perimeter framing` },
    ...(attachedToHouse ? [{ name: '2×10 PT Ledger Board',  qty: ledgerBoards, unit: 'boards', note: `${deckLength}′ along house` }] : []),
    { name: '2×8 Joist Hangers',                   qty: joistsHangers,          unit: 'hangers', note: `${joistCount} joists` },
    { name: 'Composite Deck Screws (2.5")',         qty: deckScrewLbs,           unit: 'lbs',    note: `~${SCREWS_PER_LB} screws/lb, 2 per board per joist` },
    { name: 'Structural Framing Screws',            qty: framingScrewLbs,        unit: 'lbs',    note: 'For joist hangers, ledger, rim joists' },
    { name: 'Post Base Hardware',                   qty: totalPosts,             unit: 'bases',  note: '1 per post' },
    { name: 'Concrete (80 lb bags)',                qty: concreteBags,           unit: 'bags',   note: `${CONCRETE_BAGS_PER_POST} bags per post` },
  ]
}
