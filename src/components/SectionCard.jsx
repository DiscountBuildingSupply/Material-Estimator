export default function SectionCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-4">
      {title && <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">{title}</h3>}
      {children}
    </div>
  )
}
