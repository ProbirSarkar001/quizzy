"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex mb-6 overflow-x-auto whitespace-nowrap no-scrollbar py-2 max-w-full" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-violet-500 transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-2" />
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
            <Link
              href={item.href}
              className={`text-xs font-semibold ${
                item.active
                  ? "text-violet-500 cursor-default"
                  : "text-slate-500 hover:text-violet-500 transition-colors"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
