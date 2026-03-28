import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import Pagination from '../components/common/Pagination'
import EmptyState from '../components/common/EmptyState'
import ToastContainer from '../components/common/Toast'
import { CardSkeleton } from '../components/common/Skeleton'
import FormSection from '../components/common/FormSection'
import { useAppContext } from '../contexts/AppContext'
import { useCreateLoanProduct, useLoanProducts, useUpdateLoanProduct } from '../hooks/useLoanProductQueries'
import { useToast } from '../hooks/useToast'
import { formatCurrency } from '../utils/format'

const PAGE_SIZES = [5, 10, 20, 50]

const initialForm = {
  name: '',
  description: '',
  minAmount: 500,
  interestRate: 1,
  maxAmount: 5000,
  durationMonths: 60,
}

function LoanProductsPage() {
  const { language, t } = useAppContext()
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [editingId, setEditingId] = useState(null)
  const { toasts, addToast, removeToast } = useToast()

  const { data, isLoading, isError } = useLoanProducts(page, size)
  const createMutation = useCreateLoanProduct({
    onSuccess: () => {
      setForm(initialForm)
      setEditingId(null)
      addToast(t('pages.loanProducts.saveSuccess'), 'success')
    },
  })
  const updateMutation = useUpdateLoanProduct({
    onSuccess: () => {
      setForm(initialForm)
      setEditingId(null)
      addToast(t('pages.loanProducts.saveSuccess'), 'success')
    },
  })

  const payload = data?.data
  const content = payload?.content ?? []
  const pageIndex = payload?.pageIndex ?? 0
  const totalPages = payload?.totalPages ?? 0
  const totalElements = payload?.totalElements ?? 0

  const [form, setForm] = useState(initialForm)

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const fillFormForEdit = (product) => {
    setForm({
      name: product.name ?? '',
      description: product.description ?? '',
      minAmount: product.minAmount ?? 500,
      interestRate: product.interestRate ?? 1,
      maxAmount: product.maxAmount ?? 5000,
      durationMonths: product.durationMonths ?? 60,
    })
    setEditingId(product.id)
  }

  const isSaving = createMutation.isPending || updateMutation.isPending
  const saveError = createMutation.error || updateMutation.error

  const onSubmit = (event) => {
    event.preventDefault()
    const body = {
      name: form.name.trim(),
      interestRate: Number(form.interestRate),
      minAmount: Number(form.minAmount),
      maxAmount: Number(form.maxAmount),
      durationMonths: Number(form.durationMonths),
      description: form.description?.trim() ?? '',
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, body })
    } else {
      createMutation.mutate(body)
    }
  }

  return (
    <section className="space-y-4 page-enter">
      <PageHeader title={t('pages.loanProducts.title')} subtitle={t('pages.loanProducts.subtitle')} />

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <form onSubmit={onSubmit} className="glass-card rounded-xl p-5">
          <FormSection title={editingId != null ? t('pages.loanProducts.setupTitleEdit') : t('pages.loanProducts.setupTitle')}>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('pages.loanProducts.productName')}
              </span>
              <input
                value={form.name}
                onChange={(e) => onChange('name', e.target.value)}
                className="field"
                placeholder="e.g. Personal Loan"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('pages.loanProducts.description')}
              </span>
              <input
                value={form.description}
                onChange={(e) => onChange('description', e.target.value)}
                className="field"
                placeholder="Product description"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.loanProducts.minAmount')}</span>
                <input type="number" min={0} value={form.minAmount} onChange={(e) => onChange('minAmount', Number(e.target.value))} className="field" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('common.maxAmount')}</span>
                <input type="number" min={0} value={form.maxAmount} onChange={(e) => onChange('maxAmount', Number(e.target.value))} className="field" disabled={isSaving} />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('common.interestRate')}</span>
                <input type="number" step="0.1" min={0} value={form.interestRate} onChange={(e) => onChange('interestRate', Number(e.target.value))} className="field" disabled={isSaving} />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('common.terms')}</span>
                <input type="number" min={1} value={form.durationMonths} onChange={(e) => onChange('durationMonths', Number(e.target.value))} className="field" placeholder="48" disabled={isSaving} />
              </label>
            </div>
          </FormSection>

          <button
            type="submit"
            disabled={isSaving || !form.name.trim()}
            className="mt-4 btn-primary w-full px-4 py-2.5 text-sm disabled:opacity-50"
          >
            {editingId ? t('pages.loanProducts.updateProduct') : t('pages.loanProducts.createProduct')}
          </button>
          {saveError && (
            <p className="mt-3 text-xs text-rose-600 dark:text-rose-400">{t('pages.loanProducts.saveError')}</p>
          )}
        </form>

        <article className="glass-card rounded-xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t('pages.loanProducts.productsTitle')}
            </h2>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('pages.loanProducts.totalCount')}: {totalElements}
              </p>
              <select
                value={size}
                onChange={(e) => { setSize(Number(e.target.value)); setPage(0) }}
                className="field w-20 py-1.5 text-sm"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {isLoading ? (
              <CardSkeleton count={4} />
            ) : isError ? (
              <div className="col-span-2">
                <EmptyState title={t('pages.loanProducts.loadError')} />
              </div>
            ) : content.length === 0 ? (
              <div className="col-span-2">
                <EmptyState title={t('pages.loanProducts.noProducts')} />
              </div>
            ) : (
              content.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 transition hover:border-slate-300 dark:hover:border-slate-600"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-slate-900 dark:text-slate-100">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{product.description || '\u2014'}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {product.id}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 px-2 py-1.5">
                      <p className="font-semibold text-slate-500 dark:text-slate-400">{t('common.interestRate')}</p>
                      <p>{product.interestRate}%</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 px-2 py-1.5">
                      <p className="font-semibold text-slate-500 dark:text-slate-400">{t('common.maxAmount')}</p>
                      <p>{formatCurrency(product.maxAmount, language)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 px-2 py-1.5">
                      <p className="font-semibold text-slate-500 dark:text-slate-400">{t('common.terms')}</p>
                      <p>{product.durationMonths}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 px-2 py-1.5">
                      <p className="font-semibold text-slate-500 dark:text-slate-400">{t('pages.loanProducts.minAmount')}</p>
                      <p>{formatCurrency(product.minAmount, language)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillFormForEdit(product)}
                    className="mt-3 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    {t('pages.loanProducts.edit')}
                  </button>
                </div>
              ))
            )}
          </div>

          <Pagination
            pageIndex={pageIndex}
            totalPages={totalPages}
            onPageChange={setPage}
            t={t}
          />
        </article>
      </div>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </section>
  )
}

export default LoanProductsPage
