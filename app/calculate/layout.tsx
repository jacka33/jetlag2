'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import {
  Bars3Icon,
  GlobeEuropeAfricaIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false)



  const navigation = [
    { name: 'Calculate', href: '#', icon: GlobeEuropeAfricaIcon, current: true },
    { name: 'About', href: '#', icon: QuestionMarkCircleIcon, current: false },
  ]

  function classNames(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>

              {/* Sidebar component */}
              <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 dark:bg-gray-900 dark:ring dark:ring-white/10 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-black/10">
                <div className="relative flex h-16 shrink-0 items-center">
                  <Image
                    alt="SleepLag"
                    src="/logo.png"
                    width={32}
                    height={32}
                    className="h-8 w-auto dark:hidden"
                  />
                  <Image
                    alt="SleepLag"
                    src="/logo.png"
                    width={32}
                    height={32}
                    className="h-8 w-auto not-dark:hidden"
                  />
                </div>
                <nav className="relative flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-white'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  item.current
                                    ? 'text-gray-600 dark:text-white'
                                    : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white',
                                  'size-6 shrink-0',
                                )}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>

                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col dark:bg-gray-900">
          {/* Sidebar component */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 dark:border-white/10 dark:bg-black/10">
            <div className="flex h-16 shrink-0 items-center">
              <Image
                alt="SleepLag"
                src="/logo.png"
                width={32}
                height={32}
                className="h-8 w-auto dark:hidden"
              />
              <Image
                alt="SleepLag"
                src="/logo.png"
                width={32}
                height={32}
                className="h-8 w-auto not-dark:hidden"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-white'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  item.current
                                    ? 'text-gray-600 dark:text-white'
                                    : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white',
                                  'size-6 shrink-0',
                                )}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>

                  </ul>
                </li>

              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden dark:bg-gray-900 dark:shadow-none dark:after:pointer-events-none dark:after:absolute dark:after:inset-0 dark:after:border-b dark:after:border-white/10 dark:after:bg-black/10">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:text-white"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <div className="flex-1 text-sm/6 font-semibold text-gray-900 dark:text-white">SleepLag</div>
        </div>
        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  )
}