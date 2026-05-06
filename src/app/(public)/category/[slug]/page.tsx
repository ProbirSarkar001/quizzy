import CategoryHero from "@/components/category/CategoryHero";
import SubCategoryFilters from "@/components/category/sub-category-filter";
import { QuizCard } from "@/components/home-page/quiz-listing";
import JsonLd from "@/components/common/JsonLd";
import { generateCategorySchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { notFound } from "next/navigation";
import { api } from "@/lib/eden";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data: categoryData } = await api.quiz["by-category"].get({
    query: {
      categorySlug: slug,
      page: 1,
      perPage: 1
    },
    fetch: {
      cache: "force-cache",
      next: {
        revalidate: 60 * 60
      }
    }
  });

  if (!categoryData?.category) {
    notFound();
  }

  const categoryName = categoryData.category.name;
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
  const { page = 1, subcategory } = await searchParams;

  const { data: quizzes } = await api.quiz["by-category"].get({
    query: {
      categorySlug: slug,
      page: Number(page),
      perPage: 12,
      subCategorySlug: subcategory ?? undefined
    },
    fetch: {
      cache: "force-cache",
      next: {
        revalidate: 60 * 60
      }
    }
  });

  if (!quizzes) return notFound();
  const quizzesList = quizzes.items;
  const subcategoris = quizzes.category?.subCategories || [];
  const categoryName = quizzes.category?.name || "";
  const categoryQuizCount = quizzes.category?._count.quizzes || 0;
  const currentPage = quizzes.meta?.currentPage ?? 1;
  const totalPages = quizzes.meta?.totalPages ?? 1;

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
          name: quizzes.category?.name || "",
          slug: quizzes.category?.slug || "",
          quizCount: quizzes.category?._count.quizzes || 0,
          subCategryCount: quizzes.category?.subCategories?.length || 0
        }}
      />
      <div className="">
        <SubCategoryFilters
          subCategories={subcategoris.map((sc) => ({
            name: sc.name,
            slug: sc.slug,
            count: sc._count?.quizzes ?? 0
          }))}
        />
      </div>
      <div id="quizzes" className="container mx-auto px-6 py-10">
        {quizzesList && quizzesList.length > 0 && (
          <>
            <div className="px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 container mx-auto">
              {quizzesList.map((q, i) => (
                <QuizCard key={q.id} index={i} quiz={q} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href={`/category/${slug}?page=${currentPage - 1}${subcategory ? `&subcategory=${subcategory}` : ""}`}
                        />
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const showPage = pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                      if (!showPage) {
                        if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      }
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href={`/category/${slug}?page=${pageNum}${subcategory ? `&subcategory=${subcategory}` : ""}`}
                            isActive={pageNum === currentPage}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href={`/category/${slug}?page=${currentPage + 1}${subcategory ? `&subcategory=${subcategory}` : ""}`}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </main>
    </>
  );
}
