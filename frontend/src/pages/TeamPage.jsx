import { useState } from 'react'
import { useAppContext } from '../contexts/AppContext'

const teamMembers = [
  {
    name: 'Hok Hieb',
    roleEn: 'Team Lead',
    roleKh: 'ប្រធានក្រុម',
    bioEn: 'Coordinates milestones and keeps delivery on track.',
    bioKh: 'សម្របសម្រួលគោលដៅ និងធានាការដឹកជញ្ជូនការងារតាមផែនការ។',
    accent: 'bg-blue-500',
  },
  {
    name: 'Phat Chomrong',
    photo: '/photo_2025-01-10_22-41-51.jpg',
    roleEn: 'Full Statck Engineer',
    roleKh: 'វិស្វករ Full Statck',
    bioEn: 'Use developments to build new application systems in various cases.',
    bioKh: 'ប្រើប្រាស់ការអភិវឌ្ឍន៍ក្នុងការសាងសង់ប្រព័ន្ធប្រើប្រាស់ថ្មីៗតាមករណីផ្សេងៗ។',
    accent: 'bg-slate-600',
  },
  {
    name: 'Boeurn Mnor',
    photo: '/photo_2022-05-22_22-19-40.jpg',
    roleEn: 'Full Statck Engineer',
    roleKh: 'វិស្វករ Full Statck',
    bioEn: 'Use developments to build new application systems in various cases.',
    bioKh: 'ប្រើប្រាស់ការអភិវឌ្ឍន៍ក្នុងការសាងសង់ប្រព័ន្ធប្រើប្រាស់ថ្មីៗតាមករណីផ្សេងៗ។',
    accent: 'bg-slate-500',
  },
  {
    name: 'Phim Soksamnang',
    photo: '4x6.jpg',
    roleEn: 'UI/UX Designer',
    roleKh: 'អ្នករចនា UI/UX',
    bioEn: 'Shapes user flows and visual consistency across screens.',
    bioKh: 'រចនាលំហូរអ្នកប្រើ និងរក្សាភាពស្មើគ្នានៃរចនាបទលើអេក្រង់ទាំងអស់។',
    accent: 'bg-slate-600',
  },
  {
    name: 'Yon Yen',
    roleEn: 'QA & Reporting',
    roleKh: 'QA និងរបាយការណ៍',
    bioEn: 'Validates quality, test scenarios, and reporting accuracy.',
    bioKh: 'ផ្ទៀងផ្ទាត់គុណភាព សេណារីយ៉ូតេស្ត និងភាពត្រឹមត្រូវនៃរបាយការណ៍។',
    accent: 'bg-blue-600',
  },
]

function initialsFromName(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function AvatarBadge({ member }) {
  const [imageError, setImageError] = useState(false)
  const hasPhoto = Boolean(member.photo) && !imageError

  return (
    <div
      className={`mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white dark:border-slate-700 text-2xl font-bold text-white shadow-md ${member.accent}`}
    >
      {hasPhoto ? (
        <img
          src={member.photo}
          alt={member.name}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        initialsFromName(member.name)
      )}
    </div>
  )
}

function TeamPage() {
  const { language, t } = useAppContext()

  return (
    <section className="page-enter">
      <article className="panel-card overflow-hidden rounded-xl">
        <div className="bg-slate-700 dark:bg-slate-800 px-4 py-5 text-center">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">{t('pages.team.title')}</h3>
          <p className="mt-1 text-sm text-slate-200">{t('pages.team.subtitle')}</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/30 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="glass-card rounded-xl border border-slate-200 dark:border-slate-600 p-4 text-center"
              >
                <AvatarBadge member={member} />
                <p className="mt-3 text-base font-bold text-slate-800 dark:text-slate-100">{member.name}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('pages.team.designation')}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'kh' ? member.roleKh : member.roleEn}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {language === 'kh' ? member.bioKh : member.bioEn}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <span className="inline-flex rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
              {t('pages.team.groupLabel')}: {t('pages.team.groupName')}
            </span>
          </div>

          <p className="mt-5 text-center text-sm font-medium text-slate-600 dark:text-slate-400">{t('pages.team.message')}</p>
        </div>
      </article>
    </section>
  )
}

export default TeamPage
