export default function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
      {title && <h3 className="text-base font-semibold text-slate-800 mb-4">{title}</h3>}
      {children}
    </div>
  )
}
