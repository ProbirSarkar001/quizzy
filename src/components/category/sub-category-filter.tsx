"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams, usePathname } from "next/navigation";
import { memo, useState, useMemo } from "react";

type Props = {
  subCategories: { name: string; slug: string; count: number }[];
};

function SubCategoryFilters({ subCategories }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSub = searchParams.get("subcategory");

  // Add search for subcategories if there are many
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubs = useMemo(() => {
    if (!searchTerm) return subCategories;
    return subCategories.filter((sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subCategories, searchTerm]);

  const showSearch = subCategories.length > 10;

  // Re-order: selected subcategory first (after "All")
  const orderedSubs = [...subCategories];
  if (currentSub) {
    const selectedIndex = orderedSubs.findIndex((c) => c.slug === currentSub);
    if (selectedIndex > -1) {
      const [selected] = orderedSubs.splice(selectedIndex, 1);
      orderedSubs.unshift(selected);
    }
  }

  // Build URL with updated query param
  const buildHref = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("subcategory", slug);
    else params.delete("subcategory");
    // Reset page to 1 when changing subcategory
    params.delete("page");
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="px-4 mt-6 container mx-auto">
      {showSearch && (
        <div className="mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${subCategories.length} subcategories...`}
            className="w-full px-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
      <div
        role="tablist"
        aria-label="Filter by subcategory"
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {/* All option */}
        <Link href={buildHref()} scroll={false}>
          <Badge
            role="tab"
            aria-selected={!currentSub}
            tabIndex={0}
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap cursor-pointer",
              "inline-flex items-center gap-2",
              "text-gray-700 dark:text-gray-300",
              "bg-white dark:bg-gray-800",
              "border border-gray-200/70 dark:border-gray-700 shadow-sm",
              "transition-all duration-300 ease-out",
              "hover:bg-linear-to-r hover:from-violet-500 hover:to-fuchsia-600 hover:text-white hover:shadow-lg",
              "active:scale-95 focus:ring-2 focus:ring-violet-500 focus:outline-none",
              !currentSub &&
                "bg-linear-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg"
            )}
          >
            All
          </Badge>
        </Link>

        {/* Subcategories */}
        {orderedSubs.map((cat) => {
          // Filter based on search term
          if (searchTerm && !filteredSubs.some((s) => s.slug === cat.slug)) {
            return null;
          }

          return (
            <Link key={cat.slug} href={buildHref(cat.slug)} scroll={false}>
              <Badge
                role="tab"
                aria-selected={currentSub === cat.slug}
                tabIndex={0}
                className={cn(
                  "px-4 py-2 rounded-full whitespace-nowrap cursor-pointer",
                  "inline-flex items-center gap-2",
                  "text-gray-700 dark:text-gray-300",
                  "bg-white dark:bg-gray-800",
                  "border border-gray-200/70 dark:border-gray-700 shadow-sm",
                  "transition-all duration-300 ease-out",
                  "hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-600 hover:text-white hover:shadow-lg",
                  "active:scale-95 focus:ring-2 focus:ring-violet-500 focus:outline-none",
                  currentSub === cat.slug &&
                    "bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg"
                )}
              >
                <span>{cat.name}</span>
                <span className="text-xs opacity-70">({cat.count})</span>
              </Badge>
            </Link>
          );
        })}

        {searchTerm && filteredSubs.length === 0 && (
          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
            No subcategories found
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SubCategoryFilters);
