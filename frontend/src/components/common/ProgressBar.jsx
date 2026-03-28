function ProgressBar({ value }) {
  return (
    <div className="w-full rounded-full bg-slate-200 dark:bg-slate-700">
      <div
        className="h-2 rounded-full bg-blue-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default ProgressBar
