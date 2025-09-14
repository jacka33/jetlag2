import { z } from "zod";
import { AirportSchema } from "./components/Form";

export type Airport = z.infer<typeof AirportSchema>;
