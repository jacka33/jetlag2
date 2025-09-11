"use client";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

export default function Form({ airports }) {

  const [query, setQuery] = useState('')
  const [departure, setDeparture] = useState(null);
  const [arrival, setArrival] = useState(null);

  // Filter airports
  const filteredAirports =
    query.length > 0
      ? airports.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.code?.toLowerCase().includes(query.toLowerCase())
      )
        .slice(0, 10)
      : [];

  // Clear form
  const clearForm = () => {
    setDeparture(null);
    setArrival(null);
    setQuery('');
  }

  return (
    <form>
      <div className="space-y-12">


        <div className="border-b border-gray-900/10 pb-12 dark:border-white/10" id="form">
          <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Flight information</h2>
          <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
            Enter flight info
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="departure-airport" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Departure airport (name or IATA code)
              </label>
              <div className="mt-2">
                <Combobox
                  as="div"
                  value={departure}
                  onChange={(dep) => {
                    setQuery('')
                    setDeparture(dep)
                  }}
                >
                  <div className="relative mt-2">
                    <ComboboxInput
                      name='departure-airport'
                      className="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      onChange={(event) => setQuery(event.target.value)}
                      onBlur={() => setQuery('')}
                      displayValue={(ap) => ap?.name}
                      placeholder='e.g. "Zurich" or "ZRH"'
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
                      <ChevronDownIcon className="size-5 text-gray-400" aria-hidden="true" />
                    </ComboboxButton>

                    <ComboboxOptions
                      transition
                      className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                    >
                      {query.length > 0 && (
                        <ComboboxOption
                          value={{ id: null, name: query }}
                          className="cursor-default px-3 py-2 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden dark:text-white dark:data-focus:bg-indigo-500"
                        >
                          {query}
                        </ComboboxOption>
                      )}
                      {filteredAirports.map((ap) => (
                        <ComboboxOption
                          key={ap.code}
                          value={ap}
                          className="cursor-default px-3 py-2 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden dark:text-white dark:data-focus:bg-indigo-500"
                        >
                          <div className="flex">
                            <span className="block truncate">{ap.name} ({ap.country})</span>
                            <span className="ml-2 block truncate text-gray-500 in-data-focus:text-white dark:text-gray-400 dark:in-data-focus:text-white">
                              {ap.code}
                            </span>
                          </div>
                        </ComboboxOption>
                      ))}
                    </ComboboxOptions>
                  </div>
                </Combobox>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="arrival-airport" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Arrival airport (name or IATA code)
              </label>
              <div className="mt-2">
                <Combobox
                  as="div"
                  value={arrival}
                  onChange={(arr) => {
                    setQuery('')
                    setArrival(arr)
                  }}
                >
                  <div className="relative mt-2">
                    <ComboboxInput
                      name='arrival-airport'
                      className="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      onChange={(event) => setQuery(event.target.value)}
                      onBlur={() => setQuery('')}
                      displayValue={(ap) => ap?.name}
                      placeholder='e.g. "Kuala Lumpur" or "KUL"'
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
                      <ChevronDownIcon className="size-5 text-gray-400" aria-hidden="true" />
                    </ComboboxButton>

                    <ComboboxOptions
                      transition
                      className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                    >
                      {query.length > 0 && (
                        <ComboboxOption
                          value={{ id: null, name: query }}
                          className="cursor-default px-3 py-2 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden dark:text-white dark:data-focus:bg-indigo-500"
                        >
                          {query}
                        </ComboboxOption>
                      )}
                      {filteredAirports.map((ap) => (
                        <ComboboxOption
                          key={ap.code}
                          value={ap}
                          className="cursor-default px-3 py-2 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden dark:text-white dark:data-focus:bg-indigo-500"
                        >
                          <div className="flex">
                            <span className="block truncate">{ap.name} ({ap.country})</span>
                            <span className="ml-2 block truncate text-gray-500 in-data-focus:text-white dark:text-gray-400 dark:in-data-focus:text-white">
                              {ap.code}
                            </span>
                          </div>
                        </ComboboxOption>
                      ))}
                    </ComboboxOptions>
                  </div>
                </Combobox>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Departure date / time
              </label>
              <div className="mt-2">
                <input aria-label="Date and time" type="datetime-local" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-gray-500" />


              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button onClick={clearForm} type="button" className="cursor-pointer text-sm/6 font-semibold text-gray-900 dark:text-white">
              Clear
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 dark:bg-gray-500 dark:shadow-none dark:focus-visible:outline-gray-500"
            >
              Calculate
            </button>
          </div>
        </div>
      </div>


    </form>
  )
}
