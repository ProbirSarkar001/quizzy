import { serve } from "@upstash/workflow/nextjs";
import { generateText, Output } from "ai";
import prisma from "@/lib/prisma";
import { kebabCase } from "es-toolkit";
import { QuizDoc } from "@/app/api/workflow/generate-quiz/schema";
import { format } from "date-fns";
import { model } from "@/lib/ai-models";
import {
  randomDifficulty,
  randomCount,
  pickRandomSubCategory,
  fetchExistingQuizTitles,
  generateQuizPrompt
} from "@/app/api/workflow/generate-quiz/utils";
import { WorkflowNonRetryableError } from "@upstash/workflow";

export const { POST } = serve(
  async (context) => {
    const today = format(new Date(), "MMMM d, yyyy");
    const nonce = `${today}-${Math.random().toString(36).slice(2)}`;
    const difficulty = randomDifficulty();
    const count = randomCount();

    // STEP 0: Pick random category/subcategory and fetch existing titles
    const contextResult = await context.run("prepare-quiz-context", async () => {
      const selected = await pickRandomSubCategory();
      const existingTitles = await fetchExistingQuizTitles(selected.category.id, selected.subCategory.id);
      return {
        category: selected.category,
        subCategory: selected.subCategory,
        existingTitles
      };
    });

    const { category, subCategory, existingTitles } = contextResult;

    // STEP 1: Generate quiz JSON
    const quizDoc = await context.run("generate-quiz-json", async () => {
      const result = await generateText({
        model,
        output: Output.object({
          schema: QuizDoc
        }),
        system: `Strict JSON only. No markdown. No extra commentary.`,
        prompt: generateQuizPrompt({
          categoryName: category.name,
          subCategoryName: subCategory.name,
          difficulty,
          count,
          today,
          nonce,
          existingTitles
        })
      });
      return result.output;
    });

    // STEP 2: Save quiz to database
    const savedQuiz = await context.run("save-quiz-db", async () => {
      return prisma.quiz.create({
        data: {
          quizPageTitle: quizDoc.quizPageTitle,
          quizPageDescription: quizDoc.quizPageDescription,
          categoryId: category.id,
          subCategoryId: subCategory.id,
          tags: {
            create: quizDoc.tags.map((name) => ({
              tag: {
                connectOrCreate: {
                  where: { name },
                  create: { name }
                }
              }
            }))
          },
          difficulty: quizDoc.difficulty,
          title: quizDoc.title,
          description: quizDoc.description,
          slug: kebabCase(quizDoc.quizPageTitle),
          isPublished: false,
          questions: {
            create: quizDoc.questions.map((q) => ({
              text: q.prompt,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation ?? null
            }))
          }
        },
        include: { questions: true }
      });
    });

    return { quiz: savedQuiz };
  },
  {
    failureFunction: () => {
      throw new WorkflowNonRetryableError("Failed to generate quiz");
    }
  }
);
