import { treaty } from "@elysiajs/eden";
import { app } from "../app/api/[[...slugs]]/route";

const publicUrl = process.env.BASE_URL || "http://localhost:3000";
// .api to enter /api prefix
// Use direct app treaty on server, URL-based treaty on client
export const api = treaty<typeof app>(publicUrl).api;
