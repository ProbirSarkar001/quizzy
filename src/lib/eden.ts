import { treaty } from "@elysiajs/eden";
import { app } from "../app/api/[[...slugs]]/route";

const publicUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export const api = treaty<typeof app>(publicUrl).api;
