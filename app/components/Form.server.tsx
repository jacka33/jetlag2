import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import Form from "./Form";

import type { Airport } from "../types";

export default function FormServer() {
  const filePath = path.join(process.cwd(), "public", "airports.csv");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data: Airport[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  return <Form airports={data} />;
}