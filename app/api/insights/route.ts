import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { PromptProps } from "@/app/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body: PromptProps = await req.json();
  const {
    departure_airport,
    arrival_airport,
    timezone_difference,
    direction,
    departure_time,
    arrival_time,
    flight_duration_minutes,
    usual_sleep_time,
    usual_wake_time,
    dlmo,
    core_temp_nadir,
    age,
    dep_sunrise,
    dep_sunset,
    arr_sunrise,
    arr_sunset
  } = body;

  try {
    const response = await openai.responses.create({
      prompt: {
        id: "pmpt_68cad1050014819397edc586f25d1c3301659ff4d21c5f38",
        version: "3",
        variables: {
          departure_airport,
          arrival_airport,
          timezone_difference: String(timezone_difference),
          direction,
          departure_time,
          arrival_time,
          flight_duration_minutes: String(flight_duration_minutes),
          usual_sleep_time,
          usual_wake_time,
          dlmo,
          core_temp_nadir,
          age: String(age),
          dep_sunrise,
          dep_sunset,
          arr_sunrise,
          arr_sunset
        }
      }
    });
    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
