import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import Pagination from '../components/common/Pagination'
import EmptyState from '../components/common/EmptyState'
import { TableRowSkeleton } from '../components/common/Skeleton'
import { useAppContext } from '../contexts/AppContext'
import { useCustomers } from '../hooks/useCustomerQueries'
import { formatDate } from '../utils/format'

const PAGE_SIZES = [5, 10, 20, 50]

function CustomerListPage() {
  const { language, t } = useAppContext()
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const { data, isLoading, isError } = useCustomers(page, size)
  const payload = data?.data
  const content = payload?.content ?? []
  const pageIndex = payload?.pageIndex ?? 0
  const totalPages = payload?.totalPages ?? 0
  const totalElements = payload?.totalElements ?? 0

  return (
    <section className="space-y-4 page-enter">
      <PageHeader
        title={t('pages.customers.title')}
        subtitle={t('pages.customers.subtitle')}
      />

      <article className="glass-card rounded-xl p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('pages.customers.totalCount')}: {totalElements}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-slate-600 dark:text-slate-400">{t('pages.customers.pageSize')}</span>
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value))
                setPage(0)
              }}
              className="field w-20 py-1.5 text-sm"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>

        {isError ? (
          <EmptyState
            title={t('pages.customers.loadError')}
            description={t('common.loadError')}
          />
        ) : !isLoading && content.length === 0 ? (
          <EmptyState
            title={t('pages.customers.noCustomers')}
            description={t('common.emptyData')}
          />
        ) : (
          <div className="table-shell overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="px-3 py-2.5">{t('pages.customers.id')}</th>
                  <th className="px-3 py-2.5">{t('pages.customers.fullName')}</th>
                  <th className="px-3 py-2.5">{t('pages.customers.username')}</th>
                  <th className="px-3 py-2.5">{t('pages.customers.email')}</th>
                  <th className="px-3 py-2.5">{t('pages.customers.phone')}</th>
                  <th className="px-3 py-2.5">{t('pages.customers.address')}</th>
                  <th className="px-3 py-2.5">{t('pages.customers.createdAt')}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableRowSkeleton columns={7} rows={size} />
                ) : (
                  content.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      <td className="px-3 py-2.5 font-semibold">{customer.id}</td>
                      <td className="px-3 py-2.5">{customer.fullName}</td>
                      <td className="px-3 py-2.5">{customer.username}</td>
                      <td className="px-3 py-2.5">{customer.email}</td>
                      <td className="px-3 py-2.5">{customer.phone}</td>
                      <td className="px-3 py-2.5 max-w-[180px] truncate" title={customer.address}>
                        {customer.address}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {formatDate(customer.createdAt, language)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          pageIndex={pageIndex}
          totalPages={totalPages}
          onPageChange={setPage}
          t={t}
        />
      </article>
    </section>
  )
}

export default CustomerListPage
