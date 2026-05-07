import CategoryHero from "@/components/category/CategoryHero";
import { QuizList } from "./quiz-list";
import JsonLd from "@/components/common/JsonLd";
import { generateCategorySchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import { notFound } from "next/navigation";
import { QuizService } from "@/modules/quiz/quiz.service";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const categoryData = await QuizService.getQuizzesByCategory({
    categorySlug: slug,
    page: 1,
    perPage: 1
  });

  if (!categoryData?.category) {
    notFound();
  }

  const categoryName = categoryData.category?.name;
  const baseUrl = process.env.BASE_URL ?? "https://quizzy.probir.dev";

  return {
    title: `${categoryName} Quizzes - Quizzy`,
    description: `Explore ${categoryName.toLowerCase()} quizzes on Quizzy. Test your knowledge with our collection of expertly crafted questions.`,
    alternates: {
      canonical: `${baseUrl}/category/${slug}`
    },
    openGraph: {
      title: `${categoryName} Quizzes - Quizzy`,
      description: `Explore ${categoryName.toLowerCase()} quizzes on Quizzy. Test your knowledge with our collection of expertly crafted questions.`,
      url: `${baseUrl}/category/${slug}`,
      siteName: "Quizzy",
      type: "website"
    }
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page, subcategory } = await searchParams;

  // Fetch category data for SSR hero section
  const categoryData = await QuizService.getQuizzesByCategory({
    categorySlug: slug,
    page: Number(page) || 1,
    perPage: 1
  });

  if (!categoryData?.category) {
    return notFound();
  }

  const categoryName = categoryData.category?.name || "";
  const categorySlug = categoryData.category?.slug || "";
  const categoryQuizCount = categoryData.category?._count?.quizzes || 0;
  const subCategoryCount = categoryData.category?.subCategories?.length || 0;

  return (
    <>
      <JsonLd data={generateCategorySchema({
        name: categoryName,
        slug,
        quizCount: categoryQuizCount
      })} />
      <JsonLd data={generateBreadcrumbSchema({
        items: [
          { name: "Home", href: "/" },
          { name: "Categories", href: "/category" },
          { name: categoryName, href: `/category/${slug}` }
        ]
      })} />
      <main>
        <CategoryHero
          category={{
            name: categoryName,
            slug: categorySlug,
            quizCount: categoryQuizCount,
            subCategryCount: subCategoryCount
          }}
        />
        <QuizList
          categorySlug={slug}
          initialPage={Number(page) || undefined}
          initialSubcategory={subcategory ?? null}
        />
      </main>
    </>
  );
}
