import { useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import FormSection from '../components/common/FormSection'
import EmptyState from '../components/common/EmptyState'
import ToastContainer from '../components/common/Toast'
import { TableRowSkeleton } from '../components/common/Skeleton'
import { useAppContext } from '../contexts/AppContext'
import { useRoles } from '../hooks/useRoleQueries'
import {
  useCreateUser,
  useDeleteUser,
  usePatchUserStatus,
  useUpdateUser,
  useUsers,
} from '../hooks/useUserQueries'
import { useToast } from '../hooks/useToast'
import { getNavLabelKeysForRole, KNOWN_ROLES } from '../config/navConfig'

const defaultForm = {
  username: '',
  email: '',
  password: '',
  fullName: '',
  phone: '',
  address: '',
  role: 'CUSTOMER',
}

function formatRoleCell(roleNames, t) {
  if (!roleNames?.length) return '\u2014'
  return roleNames.map((name) => t(`roles.${name}`)).join(', ')
}

function pickPrimaryRole(roleNames) {
  if (!roleNames?.length) return 'CUSTOMER'
  const order = ['ADMIN', 'MANAGER', 'OFFICER', 'CUSTOMER']
  const found = order.find((r) => roleNames.includes(r))
  return found ?? roleNames[0]
}

function readCurrentUserId() {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    const u = JSON.parse(raw)
    if (u.userId == null) return null
    const n = Number(u.userId)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

function UsersRolesPage() {
  const { language, t } = useAppContext()
  const currentUserId = useMemo(() => readCurrentUserId(), [])
  const { data: usersResponse, isLoading, isError } = useUsers(0, 100)
  const { data: rolesResponse, isLoading: rolesLoading } = useRoles(0, 50)
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()
  const statusMutation = usePatchUserStatus()
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(defaultForm)
  const [editError, setEditError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const { toasts, addToast, removeToast } = useToast()

  const users = usersResponse?.data?.content ?? []
  const roleRows = rolesResponse?.data?.content ?? []

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  const onEditChange = (key, value) => setEditForm((prev) => ({ ...prev, [key]: value }))

  const resetForm = () => {
    setForm(defaultForm)
    setError('')
  }

  const closeEdit = () => {
    setEditOpen(false)
    setEditingId(null)
    setEditForm(defaultForm)
    setEditError('')
  }

  const openEdit = (user) => {
    setEditingId(user.id)
    setEditForm({
      username: user.username ?? '',
      email: user.email ?? '',
      password: '',
      fullName: user.fullName ?? '',
      phone: user.phone ?? '',
      address: user.address ?? '',
      role: pickPrimaryRole(user.roleNames),
    })
    setEditError('')
    setEditOpen(true)
  }

  const createUserHandler = (event) => {
    event.preventDefault()
    setError('')

    const username = form.username.trim()
    const email = form.email.trim().toLowerCase()
    const password = form.password

    if (!username || !email || !password) {
      setError(t('pages.usersRoles.validationRequired'))
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError(t('pages.usersRoles.validationEmail'))
      return
    }

    const roleEntity = roleRows.find((r) => r.name === form.role)
    if (!roleEntity?.id) {
      setError(rolesLoading ? 'Loading roles\u2026' : 'Role not found.')
      return
    }

    const payload = { username, email, password, roleIds: [roleEntity.id] }
    if (form.role === 'CUSTOMER') {
      const fn = form.fullName.trim()
      if (fn) payload.fullName = fn
      payload.phone = form.phone.trim()
      payload.address = form.address.trim()
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        setForm(defaultForm)
        addToast(t('pages.usersRoles.createSuccess'), 'success')
      },
      onError: (err) => {
        setError(err.response?.data?.message ?? err.message)
      },
    })
  }

  const saveEditHandler = (event) => {
    event.preventDefault()
    setEditError('')

    const username = editForm.username.trim()
    const email = editForm.email.trim().toLowerCase()
    const password = editForm.password

    if (!username || !email) {
      setEditError(t('pages.usersRoles.validationEditRequired'))
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEditError(t('pages.usersRoles.validationEmail'))
      return
    }

    const roleEntity = roleRows.find((r) => r.name === editForm.role)
    if (!roleEntity?.id) {
      setEditError(rolesLoading ? 'Loading roles\u2026' : 'Role not found.')
      return
    }

    const payload = { username, email, roleIds: [roleEntity.id] }
    if (password) payload.password = password
    if (editForm.role === 'CUSTOMER') {
      const fn = editForm.fullName.trim()
      if (fn) payload.fullName = fn
      payload.phone = editForm.phone.trim()
      payload.address = editForm.address.trim()
    }

    updateMutation.mutate(
      { id: editingId, ...payload },
      {
        onSuccess: () => {
          closeEdit()
          addToast(t('pages.usersRoles.updateSuccess'), 'success')
        },
        onError: (err) => {
          setEditError(err.response?.data?.message ?? err.message)
        },
      },
    )
  }

  const toggleUserStatus = (user) => {
    const currentlyActive = user.active !== false
    statusMutation.mutate(
      { id: user.id, active: !currentlyActive },
      {
        onSuccess: () => addToast(t('pages.usersRoles.statusUpdateSuccess'), 'success'),
        onError: (err) => {
          const msg = err.response?.data?.message ?? err.message
          addToast(msg, 'error')
        },
      },
    )
  }

  const confirmDelete = () => {
    if (!deleteTarget?.id) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
        addToast(t('pages.usersRoles.deleteSuccess'), 'success')
      },
      onError: (err) => {
        const msg = err.response?.data?.message ?? err.message
        addToast(msg, 'error')
      },
    })
  }

  const roleOptions = useMemo(() => [...KNOWN_ROLES], [])

  return (
    <section className="space-y-4 page-enter">
      <PageHeader title={t('pages.usersRoles.title')} subtitle={t('pages.usersRoles.subtitle')} />

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <form onSubmit={createUserHandler} className="panel-card rounded-xl p-5">
          <FormSection title={t('pages.usersRoles.createTitle')} description={t('pages.usersRoles.createSubtitle')}>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.username')}</span>
              <input value={form.username} onChange={(e) => onChange('username', e.target.value)} className="field" autoComplete="username" placeholder="jdoe" />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.email')}</span>
              <input type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} className="field" autoComplete="email" placeholder="user@bank.local" />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.password')}</span>
              <input type="password" value={form.password} onChange={(e) => onChange('password', e.target.value)} className="field" autoComplete="new-password" />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.selectRole')}</span>
              <select value={form.role} onChange={(e) => onChange('role', e.target.value)} className="field">
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{t(`roles.${role}`)}</option>
                ))}
              </select>
            </label>

            {form.role === 'CUSTOMER' && (
              <>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.fullName')}</span>
                  <input value={form.fullName} onChange={(e) => onChange('fullName', e.target.value)} className="field" autoComplete="name" placeholder={t('pages.usersRoles.fullNamePlaceholder')} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.phone')}</span>
                  <input type="tel" value={form.phone} onChange={(e) => onChange('phone', e.target.value)} className="field" autoComplete="tel" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.address')}</span>
                  <textarea value={form.address} onChange={(e) => onChange('address', e.target.value)} className="field min-h-[4rem] resize-y" rows={2} autoComplete="street-address" />
                </label>
              </>
            )}
          </FormSection>

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 px-3 py-2 text-xs text-rose-700 dark:text-rose-400">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              {error}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={createMutation.isPending || rolesLoading} className="btn-primary px-4 py-2.5 text-sm disabled:opacity-50">
              {createMutation.isPending ? '\u2026' : t('pages.usersRoles.createButton')}
            </button>
            <button type="button" onClick={resetForm} className="btn-soft px-4 py-2.5 text-sm">
              {t('pages.usersRoles.resetButton')}
            </button>
          </div>
        </form>

        <article className="panel-card rounded-xl p-5">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('pages.usersRoles.userListTitle')}</h4>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('pages.usersRoles.userListSubtitle')}</p>

          {isError ? (
            <EmptyState title={t('common.loadError')} />
          ) : !isLoading && users.length === 0 ? (
            <EmptyState title={t('pages.usersRoles.noUsers')} />
          ) : (
            <div className="mt-4 table-shell overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <th className="px-3 py-2.5">{t('pages.usersRoles.userId')}</th>
                    <th className="px-3 py-2.5">{t('pages.usersRoles.username')}</th>
                    <th className="px-3 py-2.5">{t('pages.usersRoles.email')}</th>
                    <th className="px-3 py-2.5">{t('common.role')}</th>
                    <th className="px-3 py-2.5">{t('pages.usersRoles.status')}</th>
                    <th className="px-3 py-2.5">{t('pages.usersRoles.createdAt')}</th>
                    <th className="px-3 py-2.5">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <TableRowSkeleton columns={7} rows={5} />
                  ) : (
                    users.map((user) => {
                      const isSelf = currentUserId != null && Number(user.id) === currentUserId
                      const isActive = user.active !== false
                      return (
                        <tr key={user.id} className="border-b border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          <td className="px-3 py-2.5 font-semibold">{user.id}</td>
                          <td className="px-3 py-2.5">{user.username ?? '\u2014'}</td>
                          <td className="px-3 py-2.5">{user.email}</td>
                          <td className="px-3 py-2.5">{formatRoleCell(user.roleNames, t)}</td>
                          <td className="px-3 py-2.5">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>
                              {isActive ? t('pages.usersRoles.statusActive') : t('pages.usersRoles.statusInactive')}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(language === 'kh' ? 'km-KH' : 'en-US')
                              : '\u2014'}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-wrap gap-1.5">
                              <button type="button" onClick={() => openEdit(user)} className="btn-soft px-2 py-1 text-xs">
                                {t('pages.usersRoles.editUser')}
                              </button>
                              {!isSelf && (
                                <button
                                  type="button"
                                  disabled={statusMutation.isPending}
                                  onClick={() => toggleUserStatus(user)}
                                  className="btn-soft px-2 py-1 text-xs disabled:opacity-50"
                                >
                                  {isActive ? t('pages.usersRoles.deactivate') : t('pages.usersRoles.activate')}
                                </button>
                              )}
                              {!isSelf && (
                                <button
                                  type="button"
                                  disabled={deleteMutation.isPending}
                                  onClick={() => setDeleteTarget(user)}
                                  className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50 disabled:opacity-50"
                                >
                                  {t('pages.usersRoles.deleteUser')}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-user-title">
          <form onSubmit={saveEditHandler} className="panel-card max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl p-5 shadow-xl">
            <h4 id="edit-user-title" className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('pages.usersRoles.editTitle')}</h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('pages.usersRoles.editSubtitle')}</p>

            <div className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.username')}</span>
                <input value={editForm.username} onChange={(e) => onEditChange('username', e.target.value)} className="field" autoComplete="username" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.email')}</span>
                <input type="email" value={editForm.email} onChange={(e) => onEditChange('email', e.target.value)} className="field" autoComplete="email" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.passwordOptional')}</span>
                <input type="password" value={editForm.password} onChange={(e) => onEditChange('password', e.target.value)} className="field" autoComplete="new-password" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.selectRole')}</span>
                <select value={editForm.role} onChange={(e) => onEditChange('role', e.target.value)} className="field">
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{t(`roles.${role}`)}</option>
                  ))}
                </select>
              </label>
              {editForm.role === 'CUSTOMER' && (
                <>
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.fullName')}</span>
                    <input value={editForm.fullName} onChange={(e) => onEditChange('fullName', e.target.value)} className="field" autoComplete="name" />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.phone')}</span>
                    <input type="tel" value={editForm.phone} onChange={(e) => onEditChange('phone', e.target.value)} className="field" autoComplete="tel" />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.usersRoles.address')}</span>
                    <textarea value={editForm.address} onChange={(e) => onEditChange('address', e.target.value)} className="field min-h-[4rem] resize-y" rows={2} autoComplete="street-address" />
                  </label>
                </>
              )}
            </div>

            {editError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 px-3 py-2 text-xs text-rose-700 dark:text-rose-400">
                {editError}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="submit" disabled={updateMutation.isPending || rolesLoading} className="btn-primary px-4 py-2.5 text-sm disabled:opacity-50">
                {updateMutation.isPending ? '\u2026' : t('pages.usersRoles.saveButton')}
              </button>
              <button type="button" onClick={closeEdit} className="btn-soft px-4 py-2.5 text-sm">
                {t('pages.usersRoles.cancelButton')}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="panel-card w-full max-w-md rounded-xl p-5 shadow-xl">
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('pages.usersRoles.deleteConfirmTitle')}</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('pages.usersRoles.deleteConfirmBody')}</p>
            <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
              {deleteTarget.username ?? deleteTarget.email}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={confirmDelete}
                className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? '\u2026' : t('pages.usersRoles.deleteConfirmButton')}
              </button>
              <button type="button" onClick={() => setDeleteTarget(null)} className="btn-soft px-4 py-2.5 text-sm">
                {t('pages.usersRoles.cancelButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {KNOWN_ROLES.map((roleKey) => {
          const permissions = getNavLabelKeysForRole(roleKey)
          return (
            <article key={roleKey} className="panel-card rounded-xl p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                {t(`roles.${roleKey}`)}
              </h4>
              <ul className="mt-3 space-y-1.5">
                {permissions.map((permission) => (
                  <li key={permission} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                    {t(permission)}
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </section>
  )
}

export default UsersRolesPage
