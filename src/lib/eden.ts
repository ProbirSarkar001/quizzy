import { treaty } from "@elysiajs/eden";
import { app } from "../app/api/[[...slugs]]/route";

export const api = treaty<typeof app>("/api").api;
