export default function ResultsPanel({ items }) {
  const handlePrint = () => window.print()

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="text-4xl mb-3">📐</div>
        <p className="text-slate-500 text-sm">Enter dimensions above to see your materials estimate.</p>
      </div>
    )
  }

  return (
    <div className="bg-green-50 rounded-xl border border-green-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-green-800">Materials Estimate</h3>
        <button
          onClick={handlePrint}
          className="no-print text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 bg-white transition-colors"
        >
          Print / Save
        </button>
      </div>

      <div className="divide-y divide-green-200">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-start py-3">
            <div className="flex-1">
              <span className="text-sm font-medium text-slate-700">{item.name}</span>
              {item.note && (
                <p className="text-xs text-slate-400 mt-0.5">{item.note}</p>
              )}
            </div>
            <div className="text-right ml-4">
              <span className="text-lg font-bold text-green-700">{item.qty.toLocaleString()}</span>
              <span className="text-xs text-slate-500 ml-1.5">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-green-200">
        All quantities are estimates. Add waste per local code and your contractor's recommendation.
      </p>
    </div>
  )
}
