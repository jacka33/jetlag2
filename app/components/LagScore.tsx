import { MoonIcon } from '@heroicons/react/24/outline'

const stats = [
  { id: 1, name: 'LagScore', score: '71', comment: '(Moderate jetlag)', icon: MoonIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function LagScore() {
  //todo: modal to add more personalisation
  return (
    <div>
      <dl className="mt-5 gap-5">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow-sm sm:px-6 sm:pt-6 dark:bg-gray-800/75 dark:inset-ring dark:inset-ring-white/10"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-800 p-3">
                <item.icon aria-hidden="true" className="size-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.score}<span className="text-sm">/100</span></p>
              <p className="ml-2 text-medium font-semibold text-gray-900 dark:text-white">{item.comment}</p>

              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6 dark:bg-gray-700/20">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Personalise your score, jetlag plan and strategy
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
