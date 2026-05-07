import { treaty } from "@elysiajs/eden";
import { app } from "../app/api/[[...slugs]]/route";

const publicUrl = process.env.NEXT_PUBLIC_URL ?? "https://quizzy.probir.dev/";
// .api to enter /api prefix
// Use for client components
export const api = treaty<typeof app>(publicUrl).api;
