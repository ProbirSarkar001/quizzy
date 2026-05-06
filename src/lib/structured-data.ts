type QuizSchemaInput = {
  name: string;
  description: string;
  numberOfQuestions: number;
  difficulty?: string;
  categoryName: string;
  slug: string;
};

type CategorySchemaInput = {
  name: string;
  slug: string;
  quizCount: number;
};

type BreadcrumbSchemaInput = {
  items: { name: string; href: string }[];
};

const baseUrl = process.env.BASE_URL ?? "https://quizzy.probir.dev";

export function generateQuizSchema({
  name,
  description,
  numberOfQuestions,
  difficulty,
  categoryName,
  slug
}: QuizSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name,
    description,
    url: `${baseUrl}/quiz/${slug}`,
    numberOfQuestions,
    about: {
      "@type": "Thing",
      name: categoryName
    },
    ...(difficulty && {
      educationalLevel: difficulty
    })
  };
}

export function generateCategorySchema({ name, slug, quizCount }: CategorySchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${name} Quizzes`,
    description: `Explore ${name.toLowerCase()} quizzes on Quizzy. Test your knowledge with our collection of expertly crafted questions.`,
    url: `${baseUrl}/category/${slug}`,
    numberOfItems: quizCount
  };
}

export function generateBreadcrumbSchema({ items }: BreadcrumbSchemaInput) {
  const listItemElements = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${baseUrl}${item.href}`
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: listItemElements
  };
}

export function generateWebPageSchema({
  name,
  description,
  slug
}: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${baseUrl}${slug}`,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: "Quizzy",
      url: baseUrl
    }
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Quizzy",
    url: baseUrl,
    description: "Quiz Zone – Your hub for quizzes, horoscopes, and fun knowledge adventures",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/category?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}
