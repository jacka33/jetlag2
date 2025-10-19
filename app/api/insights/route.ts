import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { PromptProps } from "@/app/types";

import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

interface OpenAIErrorResponse {
  response?: {
    status: number;
    statusText: string;
    data: unknown;
    headers: Record<string, string>;
  };
  message: string;
}

const PointsExtraction = z.object({
  points: z.array(z.string())
});

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
        },

      },
      text: {
        format: zodTextFormat(PointsExtraction, "points"),

      },
    });


    return NextResponse.json({ response });
  } catch (error) {
    // Log the full error object for debugging
    console.error('OpenAI API Error:', error);

    // OpenAI errors often have additional details in the response property
    const openAIError = error as OpenAIErrorResponse;
    if (openAIError.response) {
      console.error('OpenAI Error Response:', {
        status: openAIError.response.status,
        statusText: openAIError.response.statusText,
        data: openAIError.response.data,
        headers: openAIError.response.headers
      });
    }

    return NextResponse.json({
      error: openAIError.message,
      details: openAIError.response?.data || undefined
    }, { status: 500 });
  }
}
