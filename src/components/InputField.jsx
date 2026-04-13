export default function InputField({ label, value, onChange, unit, min = 0, step = 'any', placeholder = '0' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min}
          step={step}
          placeholder={placeholder}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent w-full bg-white"
        />
        {unit && (
          <span className="inline-flex items-center px-2.5 py-2 rounded-md text-xs font-medium bg-slate-100 text-slate-500 whitespace-nowrap">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
