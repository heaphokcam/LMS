function FormSection({ title, description, children }) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function FormRow({ children }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>
}

export default FormSection
export { FormRow }
