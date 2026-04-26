import prisma from "@/lib/prisma";

type Difficulty = "easy" | "medium" | "hard";

export function randomDifficulty(): Difficulty {
  const values: Difficulty[] = ["easy", "medium", "hard"];
  return values[Math.floor(Math.random() * values.length)];
}

export function randomCount(): number {
  return 5 + Math.floor(Math.random() * 11); // random int 5–15
}

export async function pickRandomSubCategory(): Promise<{
  category: { id: number; name: string };
  subCategory: { id: number; name: string };
}> {
  const total = await prisma.category.count({
    where: { subCategories: { some: {} } }
  });

  if (total === 0) {
    throw new Error("No categories with subcategories found. Seed some data first.");
  }

  const skipCat = Math.floor(Math.random() * total);

  const pickedCategory = await prisma.category.findFirst({
    where: { subCategories: { some: {} } },
    skip: skipCat,
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      subCategories: {
        select: { id: true, name: true }
      }
    }
  });

  if (!pickedCategory || pickedCategory.subCategories.length === 0) {
    throw new Error("Selected category has no subcategories (unexpected).");
  }

  const subIdx = Math.floor(Math.random() * pickedCategory.subCategories.length);
  const pickedSub = pickedCategory.subCategories[subIdx];

  return {
    category: { id: pickedCategory.id, name: pickedCategory.name },
    subCategory: { id: pickedSub.id, name: pickedSub.name }
  };
}

export async function fetchExistingQuizTitles(
  categoryId: number,
  subCategoryId: number,
  take: number = 10
): Promise<Array<{ title: string }>> {
  return prisma.quiz.findMany({
    where: {
      categoryId,
      subCategoryId
    },
    select: {
      title: true
    },
    take
  });
}

export interface QuizPromptOptions {
  categoryName: string;
  subCategoryName: string;
  difficulty: Difficulty;
  count: number;
  today: string;
  existingTitles: Array<{ title: string }>;
}

export function generateQuizPrompt(options: QuizPromptOptions): string {
  const { categoryName, subCategoryName, difficulty, count, today, existingTitles } = options;

  const existingTitlesText =
    existingTitles.length > 0
      ? existingTitles.map((t, i) => `${i + 1}. "${t.title}"`).join("\n")
      : "No existing titles in this category/subcategory";

  return `
Create ONE complete, TEXT-ONLY, publish-ready quiz.
Category: ${categoryName}
Subcategory: ${subCategoryName}
Difficulty: ${difficulty}
Question count: ${count}

Additional context (for freshness): Today is ${today}.

EXISTING TITLES TO AVOID (prevent duplicates and confusion):
${existingTitlesText}

Hard rules:
- Provide "quizPageTitle", "quizPageDescription", "tags".
- "title"/"description" distinct from SEO fields.
- ${count} MCQs; each has 2–6 text options and a valid 0-based "correctIndex".
- Optional short "explanation".
- Plain text only; avoid markdown characters.
- Each question must be objective and allow exactly one defensible correct option. Avoid opinion-based or preference-based wording.
- The quiz theme must clearly reflect both the category and subcategory.

Uniqueness rules:
- Vary sentence length, verbs, and specificity across fields.
- Avoid repeating key nouns between title/description/prompts.
- Tags should be diverse, short, and non-redundant.
- AVOID using similar titles or themes to the existing titles listed above.

Return ONLY schema-valid JSON. No extra fields, no comments.
`;
}
