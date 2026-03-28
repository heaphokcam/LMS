import { useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import FormSection from '../components/common/FormSection'
import EmptyState from '../components/common/EmptyState'
import ToastContainer from '../components/common/Toast'
import { useAppContext } from '../contexts/AppContext'
import { useCustomers } from '../hooks/useCustomerQueries'
import { useCreateLoanApplication } from '../hooks/useLoanApplicationQueries'
import { useLoanProducts } from '../hooks/useLoanProductQueries'
import { useToast } from '../hooks/useToast'
import { calcMonthlyPayment, formatCurrency } from '../utils/format'

const LIST_SIZE = 100

const initialForm = () => ({
  customerId: '',
  productId: '',
  amount: 20000,
  termMonths: 60,
})

function readAuthCustomerId() {
  try {
    const u = JSON.parse(window.localStorage.getItem('user') || '{}')
    if (u.customerId == null) return null
    return Number(u.customerId)
  } catch {
    return null
  }
}

function readAuthUserLabel() {
  try {
    const u = JSON.parse(window.localStorage.getItem('user') || '{}')
    return (u.username || u.email || '').trim() || null
  } catch {
    return null
  }
}

function ApplyLoanPage() {
  const { language, role, t } = useAppContext()
  const isCustomerRole = role === 'CUSTOMER'
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const { toasts, addToast, removeToast } = useToast()

  const { data: custResp, isLoading: loadingCustomers, isError: loadCustomersError } = useCustomers(0, LIST_SIZE, {
    enabled: !isCustomerRole,
  })
  const { data: prodResp, isLoading: loadingProducts, isError: loadProductsError } = useLoanProducts(0, LIST_SIZE)

  const customers = useMemo(() => custResp?.data?.content ?? [], [custResp?.data?.content])
  const products = useMemo(() => prodResp?.data?.content ?? [], [prodResp?.data?.content])

  const authCustomerId = useMemo(() => (isCustomerRole ? readAuthCustomerId() : null), [isCustomerRole])
  const selfUserLabel = useMemo(() => (isCustomerRole ? readAuthUserLabel() : null), [isCustomerRole])

  const createMutation = useCreateLoanApplication({
    onSuccess: () => {
      setError('')
      addToast(t('pages.applyLoan.successMessage'), 'success')
    },
    onError: (err) => {
      setError(err.response?.data?.message ?? err.message ?? 'Failed to submit')
    },
  })

  const effectiveProductId = useMemo(() => {
    if (form.productId !== '' && form.productId != null) return Number(form.productId)
    const p0 = products[0]
    return p0?.id != null ? Number(p0.id) : null
  }, [form.productId, products])

  const selectedProduct = useMemo(
    () =>
      effectiveProductId == null
        ? undefined
        : products.find((product) => Number(product.id) === effectiveProductId),
    [effectiveProductId, products],
  )

  const effectiveStaffCustomerId = useMemo(() => {
    if (isCustomerRole) return null
    if (form.customerId !== '' && form.customerId != null) return Number(form.customerId)
    const c0 = customers[0]
    return c0?.id != null ? Number(c0.id) : null
  }, [isCustomerRole, form.customerId, customers])

  const productInterestRate = useMemo(
    () => Number(selectedProduct?.interestRate ?? 0),
    [selectedProduct],
  )

  const monthlyInstallment = calcMonthlyPayment(form.amount, productInterestRate, form.termMonths)

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const onProductChange = (productId) => {
    setForm((prev) => ({
      ...prev,
      productId: productId === '' ? '' : Number(productId),
    }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    setError('')
    if (effectiveProductId == null) {
      setError(t('pages.applyLoan.validationProductOnly') ?? 'Select a loan product.')
      return
    }
    if (isCustomerRole) {
      if (authCustomerId == null) {
        setError(t('pages.applyLoan.profileNotLinked'))
        return
      }
      createMutation.mutate({
        customerId: authCustomerId,
        loanProductId: effectiveProductId,
        amount: Number(form.amount),
        durationMonths: Number(form.termMonths),
      })
      return
    }
    if (effectiveStaffCustomerId == null) {
      setError(t('pages.applyLoan.validationRequired') ?? 'Select customer and product.')
      return
    }
    createMutation.mutate({
      customerId: effectiveStaffCustomerId,
      loanProductId: effectiveProductId,
      amount: Number(form.amount),
      durationMonths: Number(form.termMonths),
    })
  }

  const selectedCustomer = customers.find((c) => Number(c.id) === effectiveStaffCustomerId)
  const loading = (isCustomerRole ? false : loadingCustomers) || loadingProducts
  const loadError = (!isCustomerRole && loadCustomersError) || loadProductsError
  const customerProfileBlocked = isCustomerRole && authCustomerId == null

  return (
    <section className="space-y-4 page-enter">
      <PageHeader title={t('pages.applyLoan.title')} subtitle={t('pages.applyLoan.subtitle')} />

      {loadError ? (
        <EmptyState title={t('common.loadError')} />
      ) : customerProfileBlocked ? (
        <EmptyState title={t('pages.applyLoan.profileNotLinked')} />
      ) : !loading && products.length === 0 ? (
        <EmptyState title={t('common.emptyData')} />
      ) : null}

      <form
        onSubmit={onSubmit}
        className={`grid gap-6 glass-card rounded-xl p-5 lg:grid-cols-2 ${
          loading || loadError || customerProfileBlocked || products.length === 0 ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        <div className="space-y-5">
          <FormSection title={t('pages.applyLoan.personalInfo')}>
            {isCustomerRole ? (
              <div className="rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/50 px-3 py-3">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {selfUserLabel ?? t('common.customer')}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t('pages.applyLoan.applyingForSelf')}
                </p>
                {authCustomerId != null && (
                  <p className="mt-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                    {t('pages.applyLoan.customerId')}: {authCustomerId}
                  </p>
                )}
              </div>
            ) : (
              <>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t('pages.applyLoan.customerName')}
                  </span>
              <select
                value={effectiveStaffCustomerId != null ? String(effectiveStaffCustomerId) : ''}
                onChange={(e) => onChange('customerId', e.target.value === '' ? '' : Number(e.target.value))}
                className="field"
                disabled={loadingCustomers}
              >
                    <option value="">{loadingCustomers ? '\u2026' : t('pages.applyLoan.selectCustomer') ?? 'Select customer'}</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.fullName} (ID {c.id})</option>
                    ))}
                  </select>
                </label>
                {selectedCustomer && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedCustomer.phone ?? ''} {selectedCustomer.email ? `\u2022 ${selectedCustomer.email}` : ''}
                  </p>
                )}
              </>
            )}
          </FormSection>
        </div>

        <div className="space-y-5">
          <FormSection title={t('pages.applyLoan.loanDetails')}>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.history.product')}</span>
              <select
                value={effectiveProductId != null ? String(effectiveProductId) : ''}
                onChange={(e) => onProductChange(e.target.value)}
                className="field"
                disabled={loadingProducts}
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('common.amount')}</span>
                <input type="number" value={form.amount} onChange={(e) => onChange('amount', Number(e.target.value))} className="field" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('common.terms')}</span>
                <input type="number" value={form.termMonths} onChange={(e) => onChange('termMonths', Number(e.target.value))} className="field" />
              </label>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/50 px-3 py-2.5 text-sm">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('common.interestRate')}</p>
              <p className="mt-0.5 font-medium text-slate-800 dark:text-slate-100">
                {selectedProduct != null ? `${productInterestRate}%` : '\u2014'}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('pages.applyLoan.productRateNote')}</p>
            </div>
          </FormSection>

          <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {t('pages.applyLoan.monthlyInstallment')}
            </p>
            <p className="mt-1 text-xl font-bold text-blue-700 dark:text-blue-300">
              {formatCurrency(monthlyInstallment, language)}
            </p>
            <p className="mt-0.5 text-xs text-blue-500 dark:text-blue-400">{selectedProduct?.name ?? ''}</p>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending || loading}
            className="btn-primary w-full px-4 py-2.5 text-sm disabled:opacity-50"
          >
            {createMutation.isPending ? '\u2026' : t('pages.applyLoan.submitApplication')}
          </button>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 px-3 py-2 text-xs text-rose-700 dark:text-rose-400">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              {error}
            </div>
          )}
        </div>
      </form>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </section>
  )
}

export default ApplyLoanPage
