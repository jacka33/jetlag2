"use client";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { isValidDateTime } from '../utils/DateTimeValidator';
import { CalculateDistance, CalculateFlightTime, CalculateDirection } from '../utils/FlightCalculator';
import { useAppDispatch } from '../redux/hooks';
import { setDistance, setTime, setDepCoords, setArrCoords, setDirection, setDeparture, setArrival, setDepartureDateTime } from '../redux/flightSlice';

import type { Airport } from '../types';

export const AirportSchema = z.object({
  code: z.string(),
  icao: z.string().nullable(),
  name: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  elevation: z.string().nullable(),
  url: z.string().nullable(),
  time_zone: z.string().min(1, "Timezone is missing. Try another airport."),
  city_code: z.string().nullable(),
  country: z.string(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  county: z.string().nullable(),
  type: z.string().nullable(),
});


export default function Form({ airports }: { airports: Airport[] }) {
  const [query, setQuery] = useState('');
  const [arrivalQuery, setArrivalQuery] = useState('');
  const [validDt, setValidDt] = useState(true);
  const dispatch = useAppDispatch();


  // const validAirportCodes = new Set(airports.map((a) => a.code));
  // const codeEnum = z.enum(Array.from(validAirportCodes)).or(z.literal(""));

  const formSchema = z.object({
    departure: AirportSchema.optional().nullable().refine(
      (val) => !!val && !!val.code,
      { message: "Choose a departure airport" }
    ),
    arrival: AirportSchema.optional().nullable().refine(
      (val) => !!val && !!val.code,
      { message: "Choose an arrival airport" }
    ),
    departureDateTime: z.iso.datetime({ local: true, error: "Invalid date/time" }),
  });

  type FormData = z.infer<typeof formSchema>;

  const { handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      departure: null,
      arrival: null,
      departureDateTime: "",
    },
  });

  const onSubmit = (data: FormData) => {

    const validDt = isValidDateTime(data.departureDateTime, data.departure!.time_zone);

    setValidDt(validDt);

    if (!validDt) {
      return;
    }

    // const validDep = codeEnum.safeParse(data.departure?.code || "");
    // const validArr = codeEnum.safeParse(data.arrival?.code || "");

    // if (!validDep.success || !validArr.success) {
    //   console.error("Invalid airport code");
    //   return;
    // }

    const flightDistance = CalculateDistance(parseFloat(data.departure!.latitude), parseFloat(data.departure!.longitude), parseFloat(data.arrival!.latitude), parseFloat(data.arrival!.longitude));
    const flightTime = CalculateFlightTime(flightDistance); // returns time in whole minutes
    const flightDirection = CalculateDirection(parseFloat(data.departure!.longitude), parseFloat(data.arrival!.longitude));


    dispatch(setDistance(flightDistance)); // in nm
    dispatch(setTime(flightTime)); // in minutes
    dispatch(setDepCoords([parseFloat(data.departure!.longitude), parseFloat(data.departure!.latitude)]));
    dispatch(setArrCoords([parseFloat(data.arrival!.longitude), parseFloat(data.arrival!.latitude)]));
    dispatch(setDirection(flightDirection));
    dispatch(setDeparture(data.departure!));
    dispatch(setArrival(data.arrival!));
    dispatch(setDepartureDateTime(data.departureDateTime));

    console.log(data);

  }

  const filteredAirports = query.length > 0
    ? airports.filter(
      (a) =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.code?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10)
    : [];

  const filteredArrivalAirports = arrivalQuery.length > 0
    ? airports.filter(
      (a) =>
        a.name.toLowerCase().includes(arrivalQuery.toLowerCase()) ||
        a.code?.toLowerCase().includes(arrivalQuery.toLowerCase())
    ).slice(0, 10)
    : [];

  const clearForm = () => {
    reset();
    setQuery('');
    setArrivalQuery('');

    // Clear all flight data from Redux
    dispatch(setDeparture(undefined));
    dispatch(setArrival(undefined));
    dispatch(setDistance(0));
    dispatch(setTime(0));
    dispatch(setDepCoords([0, 0]));
    dispatch(setArrCoords([0, 0]));
    dispatch(setDirection(''));
    dispatch(setDepartureDateTime(''));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12 dark:border-white/10" id="form">
          <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Flight information</h2>
          <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
            Enter flight info
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Departure Combobox */}
            <div className="sm:col-span-2 sm:col-start-1">
              <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Departure airport (name or IATA code)
              </label>
              <div className="mt-2">
                <Controller
                  name="departure"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      as="div"
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        setQuery('');
                      }}
                    >
                      <div className="relative mt-2">
                        <ComboboxInput
                          className="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                          onChange={(event) => setQuery(event.target.value)}
                          onBlur={() => setQuery('')}
                          displayValue={(ap: Airport) => (ap && ap.name && ap.code) ? `${ap.name} ${ap.code}` : ''}
                          placeholder='e.g. "Zurich" or "ZRH"'
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
                          <ChevronDownIcon className="size-5 text-gray-400" aria-hidden="true" />
                        </ComboboxButton>
                        <ComboboxOptions
                          transition
                          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 sm:text-sm dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                        >
                          {filteredAirports.map((ap: Airport) => (
                            <ComboboxOption
                              key={ap.code}
                              value={ap}
                              className="cursor-default px-3 py-2 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden dark:text-white dark:data-focus:bg-indigo-500"
                            >
                              <div className="flex">
                                <span className="block truncate">{ap?.name} ({ap.country})</span>
                                <span className="ml-2 block truncate dark:text-gray-400">
                                  {ap.code}
                                </span>
                              </div>
                            </ComboboxOption>
                          ))}
                        </ComboboxOptions>
                      </div>
                    </Combobox>
                  )}
                />
                {errors.departure && (
                  <p className="mt-2 text-sm text-red-600">{errors.departure.message}</p>
                )}
              </div>
            </div>
            {/* Arrival Combobox */}
            <div className="sm:col-span-2">
              <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Arrival airport (name or IATA code)
              </label>
              <div className="mt-2">
                <Controller
                  name="arrival"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      as="div"
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        setArrivalQuery('');
                      }}
                    >
                      <div className="relative mt-2">
                        <ComboboxInput
                          className="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                          onChange={(event) => setArrivalQuery(event.target.value)}
                          onBlur={() => setArrivalQuery('')}
                          displayValue={(ap: Airport) => (ap && ap.name && ap.code) ? `${ap.name} ${ap.code}` : ''}
                          placeholder='e.g. "Hong Kong" or "HKG"'
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
                          <ChevronDownIcon className="size-5 text-gray-400" aria-hidden="true" />
                        </ComboboxButton>
                        <ComboboxOptions
                          transition
                          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 sm:text-sm dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                        >
                          {filteredArrivalAirports.map((ap) => (
                            <ComboboxOption
                              key={ap.code}
                              value={ap}
                              className="cursor-default px-3 py-2 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden dark:text-white dark:data-focus:bg-indigo-500"
                            >
                              <div className="flex">
                                <span className="block truncate">{ap?.name} ({ap.country})</span>
                                <span className="ml-2 block truncate dark:text-gray-400">
                                  {ap.code}
                                </span>
                              </div>
                            </ComboboxOption>
                          ))}
                        </ComboboxOptions>
                      </div>
                    </Combobox>
                  )}
                />
                {errors.arrival && (
                  <p className="mt-2 text-sm text-red-600">{errors.arrival.message}</p>
                )}
              </div>
            </div>
            {/* Date/Time */}
            <div className="sm:col-span-2">
              <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Departure date / time
              </label>
              <div className="mt-2">
                <Controller
                  name="departureDateTime"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      aria-label="Date and time"
                      type="datetime-local"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-gray-500"
                    />
                  )}
                />
              </div>
              {errors.departureDateTime && (
                <p className="mt-2 text-sm text-red-600">{errors.departureDateTime.message}</p>
              )}
              {!validDt && (
                <p className="mt-2 text-sm text-red-600">Departure must be at least 3 days in the future.</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button onClick={clearForm} type="button" className="cursor-pointer text-sm/6 font-semibold text-gray-900 dark:text-white">
              Clear form and results
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
  );
}
