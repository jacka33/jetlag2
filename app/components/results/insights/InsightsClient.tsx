import { CircleLoader } from "react-spinners";

import useSWR from "swr";
import Insights from "../Insights";
import { PromptProps } from "@/app/types";


const fetcher = async (url: string, body: PromptProps) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Failed to fetch AI insights");
  return res.json();
};

export default function InsightsClient(props: PromptProps) {
  const { data, error, isLoading } = useSWR([
    "/api/insights",
    props
  ], ([url, body]) => fetcher(url, body), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false
  });

  if (isLoading) return <div className="sweet-loading text-center">
    <h3 className="text-base text-blue-600">AI insights are loading. Please wait.<br />
      It may take up to a minute.</h3>
    <CircleLoader
      className="mx-auto mt-4"
      color="#155dfc"
      loading={isLoading}
      size={100}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  </div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  // @ts-expect-error: dont know openai types yet
  return <Insights response={data.response} />;
}
