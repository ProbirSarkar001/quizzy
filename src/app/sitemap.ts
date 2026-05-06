import { MetadataRoute } from "next";
import { api } from "@/lib/eden";
import { ZodiacSign } from "@/generated/prisma/client";

const baseUrl = process.env.BASE_URL ?? "https://quizzy.probir.dev";
const currentDate = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categoriesRes, homeDataRes] = await Promise.all([
    api.quiz.categories.get(),
    api.quiz["home-data"].get()
  ]);

  const categories = categoriesRes.data ?? [];
  const homeData = homeDataRes.data ?? [];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${baseUrl}/category`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${baseUrl}/horoscope`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${baseUrl}/this-day-in-history`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8
    }
  ];

  // Collect all quizzes from home data
  const allQuizzes = homeData.flatMap((category) => category.quizzes ?? []);

  const quizUrls: MetadataRoute.Sitemap = allQuizzes.map((quiz) => ({
    url: `${baseUrl}/quiz/${quiz.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  const horoscopeUrls: MetadataRoute.Sitemap = Object.values(ZodiacSign).map((sign) => ({
    url: `${baseUrl}/horoscope/${sign.toLowerCase()}`,
    lastModified: currentDate,
    changeFrequency: "daily" as const,
    priority: 0.7
  }));

  return [...staticPages, ...quizUrls, ...categoryUrls, ...horoscopeUrls];
}
