import { useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import StatCard from '../components/common/StatCard'
import { useAppContext } from '../contexts/AppContext'
import { calcMonthlyPayment, formatCurrency } from '../utils/format'

function generateSchedule(principal, annualRate, months, startDate) {
  const payment = calcMonthlyPayment(principal, annualRate, months)
  const monthlyRate = annualRate / 100 / 12

  let balance = principal
  const schedule = []
  const cursor = new Date(startDate)

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate
    const principalPart = payment - interest
    balance = Math.max(0, balance - principalPart)
    cursor.setMonth(cursor.getMonth() + 1)

    schedule.push({
      month,
      dueDate: cursor.toISOString().slice(0, 10),
      payment,
      principal: principalPart,
      interest,
      balance,
    })
  }

  return schedule
}

function RepaymentCalculatorPage() {
  const { language, t } = useAppContext()

  const [principal, setPrincipal] = useState(25000)
  const [annualRate, setAnnualRate] = useState(9.2)
  const [termMonths, setTermMonths] = useState(60)
  const [firstDate, setFirstDate] = useState('2026-04-01')
  const [schedule, setSchedule] = useState(() =>
    generateSchedule(25000, 9.2, 60, '2026-04-01').slice(0, 12),
  )

  const monthlyPayment = calcMonthlyPayment(principal, annualRate, termMonths)

  const totals = useMemo(() => {
    const totalRepayment = monthlyPayment * termMonths
    return {
      totalRepayment,
      totalInterest: totalRepayment - principal,
    }
  }, [monthlyPayment, principal, termMonths])

  const onGenerate = (event) => {
    event.preventDefault()
    setSchedule(generateSchedule(principal, annualRate, termMonths, firstDate).slice(0, 12))
  }

  return (
    <section className="space-y-4 page-enter">
      <PageHeader title={t('pages.calculator.title')} subtitle={t('pages.calculator.subtitle')} />

      <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <form
          onSubmit={onGenerate}
          className="glass-card rounded-xl p-5"
        >
          <div className="space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('pages.calculator.loanAmount')}
              </span>
              <input
                type="number"
                value={principal}
                onChange={(event) => setPrincipal(Number(event.target.value))}
                className="field"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('pages.calculator.annualRate')}
              </span>
              <input
                type="number"
                step="0.1"
                value={annualRate}
                onChange={(event) => setAnnualRate(Number(event.target.value))}
                className="field"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('pages.calculator.termMonths')}
              </span>
              <input
                type="number"
                value={termMonths}
                onChange={(event) => setTermMonths(Number(event.target.value))}
                className="field"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('pages.calculator.firstRepaymentDate')}
              </span>
              <input
                type="date"
                value={firstDate}
                onChange={(event) => setFirstDate(event.target.value)}
                className="field"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 btn-primary w-full px-4 py-2 text-sm"
          >
            {t('pages.calculator.generateSchedule')}
          </button>
        </form>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title={t('pages.applyLoan.monthlyInstallment')}
              value={formatCurrency(monthlyPayment, language)}
              accent="bg-blue-500"
            />
            <StatCard
              title={t('pages.calculator.totalInterest')}
              value={formatCurrency(totals.totalInterest, language)}
              accent="bg-amber-500"
            />
            <StatCard
              title={t('pages.calculator.totalRepayment')}
              value={formatCurrency(totals.totalRepayment, language)}
              accent="bg-emerald-500"
            />
            <StatCard
              title={t('pages.calculator.schedule')}
              value={`12 / ${termMonths}`}
              hint={t('common.previewFirst12')}
              accent="bg-slate-500"
            />
          </div>

          <article className="glass-card rounded-xl p-5">
            <div className="table-shell">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">{t('common.dueDate')}</th>
                    <th className="px-3 py-2">{t('common.payment')}</th>
                    <th className="px-3 py-2">{t('common.principalLabel')}</th>
                    <th className="px-3 py-2">{t('common.interest')}</th>
                    <th className="px-3 py-2">{t('common.balance')}</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.month} className="border-b border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      <td className="px-3 py-2">{row.month}</td>
                      <td className="px-3 py-2">{row.dueDate}</td>
                      <td className="px-3 py-2">{formatCurrency(row.payment, language)}</td>
                      <td className="px-3 py-2">{formatCurrency(row.principal, language)}</td>
                      <td className="px-3 py-2">{formatCurrency(row.interest, language)}</td>
                      <td className="px-3 py-2">{formatCurrency(row.balance, language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default RepaymentCalculatorPage
