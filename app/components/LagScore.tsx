import { MoonIcon, ChevronDoubleDownIcon, ChevronDoubleUpIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline'

const factors = [
  { name: 'Flight time', value: "Medium", icon: ChevronDoubleUpIcon, iconColour: "text-red-600" },
  { name: 'Time difference', value: "Large", icon: ChevronDoubleRightIcon, iconColour: "text-gray-600" },
  { name: 'Direction', value: "Eastbound", icon: ChevronDoubleDownIcon, iconColour: "text-green-600" },
  { name: 'Departure time', value: "Late night", icon: ChevronDoubleUpIcon, iconColour: "text-red-600" },
]

const stats = [
  { id: 1, name: 'LagScore', score: '71', comment: 'Moderate jetlag', factors: factors, icon: MoonIcon },
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
            className="relative overflow-hidden pt-5 pb-12 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-800 p-3">
                <item.icon aria-hidden="true" className="size-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-blue-800 dark:text-blue-400">{item.name} <span className='text-xs text-gray-500'>(Lower is better)</span></p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-4 sm:pb-4">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.score}<span className="text-sm">/100</span></p>
              <p className="ml-2 text-medium font-semibold text-gray-700 dark:text-white">{item.comment}</p>
            </dd>
            <div className="relative mb-2">
              {item.factors.map((factor) => (
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
        ))}
      </dl>
    </div>
  )
}
