import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import Form from "./Form";

interface Airport {
  code: string;
  icao: string | null;
  name: string;
  latitude: string;
  longitude: string;
  elevation: string | null;
  url: string | null;
  time_zone: string;
  city_code: string | null;
  country: string;
  city: string | null;
  state: string | null;
  county: string | null;
  type: string | null;
}

export default function FormServer() {
  const filePath = path.join(process.cwd(), "public", "airports.csv");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data: Airport[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  return <Form airports={data} />;
}