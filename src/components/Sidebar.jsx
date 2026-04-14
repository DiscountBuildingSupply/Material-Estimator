const NAV_ITEMS = [
  {
    id: 'framing',
    label: 'Framing / Lumber',
    description: 'Studs, joists, rafters',
    activeColor: 'bg-amber-500',
    activeBg: 'bg-amber-50',
    activeText: 'text-amber-700',
    activeBorder: 'border-amber-200',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'concrete',
    label: 'Concrete / Masonry',
    description: 'Slabs, footings, block walls',
    activeColor: 'bg-slate-500',
    activeBg: 'bg-slate-50',
    activeText: 'text-slate-700',
    activeBorder: 'border-slate-300',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: 'roofing',
    label: 'Roofing',
    description: 'Shingles, underlayment',
    activeColor: 'bg-rose-500',
    activeBg: 'bg-rose-50',
    activeText: 'text-rose-700',
    activeBorder: 'border-rose-200',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'drywall',
    label: 'Drywall / Insulation',
    description: 'Sheets, mud, insulation',
    activeColor: 'bg-violet-500',
    activeBg: 'bg-violet-50',
    activeText: 'text-violet-700',
    activeBorder: 'border-violet-200',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    id: 'siding',
    label: 'Siding',
    description: 'Dutchlap, Hardie lap & sheet',
    activeColor: 'bg-teal-500',
    activeBg: 'bg-teal-50',
    activeText: 'text-teal-700',
    activeBorder: 'border-teal-200',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
  },
  {
    id: 'landscaping',
    label: 'Landscaping',
    description: 'Mulch & gravel by half-ton',
    activeColor: 'bg-green-500',
    activeBg: 'bg-green-50',
    activeText: 'text-green-700',
    activeBorder: 'border-green-200',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
]

export default function Sidebar({ active, onSelect }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-white border-r border-slate-200 p-4 no-print">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-sm">Material Estimator</span>
          </div>
          <p className="text-xs text-slate-400 pl-9">Instant quantity takeoffs</p>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(item => {
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors w-full ${
                  isActive
                    ? `${item.activeBg} ${item.activeText} border ${item.activeBorder} font-semibold`
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <span className={isActive ? item.activeText : 'text-slate-400'}>{item.icon}</span>
                <div>
                  <div className="text-sm leading-tight">{item.label}</div>
                  <div className="text-xs text-slate-400 font-normal leading-tight mt-0.5">{item.description}</div>
                </div>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Mobile tab strip */}
      <div className="md:hidden flex overflow-x-auto border-b border-slate-200 bg-white no-print">
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap text-sm flex-shrink-0 border-b-2 transition-colors ${
                isActive
                  ? 'border-brand-500 text-brand-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
