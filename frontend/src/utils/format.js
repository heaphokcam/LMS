export function formatCurrency(value, language = 'en') {
  const locale = language === 'kh' ? 'km-KH' : 'en-US'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(dateValue, language = 'en') {
  const locale = language === 'kh' ? 'km-KH' : 'en-US'

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateValue))
}

export function calcMonthlyPayment(principal, annualRate, months) {
  const p = Number(principal)
  const r = Number(annualRate) / 100 / 12
  const n = Number(months)

  if (!p || !r || !n) {
    return 0
  }

  const payment = (p * r * (1 + r) ** n) / ((1 + r) ** n - 1)
  return Number.isFinite(payment) ? payment : 0
}
