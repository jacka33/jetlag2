import { MoonIcon } from '@heroicons/react/24/outline'
import LagScoreCalculator from '../../utils/LagScoreCalculator'

export default function LagScore() {
  const stats = LagScoreCalculator();

  //todo: modal to add more personalisation
  return (
    <div>
      <dl className="mt-5 gap-5">
        <div
          className="relative overflow-hidden pt-5 pb-12 sm:pt-6"
        >
          <dt>
            <div className={`absolute rounded-md ${stats.iconColour} p-3`}>
              <MoonIcon aria-hidden="true" className="size-6 text-white" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-black dark:text-white">LagScore <span className='text-xs text-gray-400'>(Lower is better)</span></p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-4 sm:pb-4">
            <p className={`${stats.scoreColour} text-2xl font-semibold`}>{stats.score}<span className="text-sm text-gray-400">/100</span></p>
            <p className={`ml-2 text-medium font-semibold ${stats.scoreColour}`}>{stats.comment}</p>
          </dd>
          <div className="relative mb-2">
            {stats.factors.map((factor) => (
              <p className="text-medium font-semibold text-gray-900 dark:text-white" key={factor.name}>
                {factor.name}: {factor.value}{' '}
                <factor.icon aria-hidden="true" className={`inline size-4 ${factor.iconColour || ''}`} />
              </p>
            ))
            }
          </div>
          <div className="absolute inset-x-0 bottom-0 py-4">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Personalise your score, jetlag plan and strategy
              </a>
            </div>
          </div>
        </div>
      </dl>
    </div>
  )
}
