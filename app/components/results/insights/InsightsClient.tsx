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

  if (isLoading) return <div>Loading AI insights...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  // @ts-expect-error: dont know openai types yet
  return <Insights response={data.response} />;
}
