import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY || "" });

export const model = openrouter(process.env.OPENROUTER_MODEL || "", {
  models: [...(process.env.OPENROUTER_EXTRA_MODELS?.split(",") || [])]
});
