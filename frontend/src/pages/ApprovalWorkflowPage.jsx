import PageHeader from '../components/common/PageHeader'
import { useAppContext } from '../contexts/AppContext'
import { approvalWorkflow } from '../data/workflowSteps'

function ApprovalWorkflowPage() {
  const { language, t } = useAppContext()

  return (
    <section className="space-y-4 page-enter">
      <PageHeader title={t('pages.workflow.title')} subtitle={t('pages.workflow.subtitle')} />

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t('pages.tracking.timeline')}</h2>
          {approvalWorkflow.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{t('common.emptyData')}</p>
          ) : (
            <div className="mt-4 space-y-3">
              {approvalWorkflow.map((step, index) => (
                <div key={step.id} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 py-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t('common.step')} {index + 1}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{language === 'kh' ? step.stepKh : step.step}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {t('pages.workflow.stepOwner')}: {t(`roles.${step.role}`)}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {t('pages.workflow.sla')}: {step.sla}
                  </p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t('pages.workflow.approvalComments')}
          </h2>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            {language === 'kh'
              ? 'មិនមាន API សម្រាប់មតិយោបល់អនុម័តនៅពេលនេះ។'
              : 'Approval comments are not stored in the API yet.'}
          </p>
        </article>
      </div>
    </section>
  )
}

export default ApprovalWorkflowPage
