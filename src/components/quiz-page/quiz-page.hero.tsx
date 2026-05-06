"use client";

import { Sparkles, Target, Layers } from "lucide-react";
import { QuizPageType } from "@/queries/home-page";
import { QuizDifficulty } from "@/generated/prisma/enums";

import { BreadcrumbItem } from "../common/Breadcrumbs";
import Breadcrumbs from "../common/Breadcrumbs";

export default function QuizHero({ quiz, breadcrumbs }: { quiz: QuizPageType; breadcrumbs: BreadcrumbItem[] }) {
  if (!quiz) return null;

  const difficultyColors = {
    [QuizDifficulty.easy]: "from-emerald-400 to-teal-500",
    [QuizDifficulty.medium]: "from-amber-400 to-orange-500",
    [QuizDifficulty.hard]: "from-rose-400 to-fuchsia-500"
  };

  const difficultyTextColors = {
    [QuizDifficulty.easy]: "text-emerald-400",
    [QuizDifficulty.medium]: "text-amber-400",
    [QuizDifficulty.hard]: "text-rose-400"
  };

  const bgColor = difficultyColors[quiz.difficulty as QuizDifficulty] || "from-violet-400 to-fuchsia-500";
  const textColor = difficultyTextColors[quiz.difficulty as QuizDifficulty] || "text-violet-400";

  return (
    <div className="relative overflow-hidden bg-gray-50 dark:bg-slate-950 pt-24 md:pt-28 pb-12 md:pb-16">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/2 -right-1/4 w-[70%] h-[70%] rounded-full bg-gradient-to-br ${bgColor} opacity-10 dark:opacity-20 blur-[120px]`}
        />
        <div
          className={`absolute -bottom-1/2 -left-1/4 w-[70%] h-[70%] rounded-full bg-gradient-to-br ${bgColor} opacity-5 dark:opacity-10 blur-[120px]`}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left Side */}
          <div className="flex-1 text-center lg:text-left w-full max-w-full">
            <div className="mb-4 flex justify-center lg:justify-start w-full">
              <Breadcrumbs items={breadcrumbs} />
            </div>

            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md mb-4`}
            >
              <span className="text-[10px] font-bold tracking-widest text-gray-700 dark:text-white/80 uppercase">
                {quiz.category?.name || "General"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight break-words">
              {quiz.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 max-w-2xl mb-5 leading-relaxed break-words">
              {quiz.description || "Challenge yourself with this expertly curated quiz and see how you rank!"}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {quiz.tags.map((tag, i) => (
                <span
                  key={tag.tagId}
                  className="px-3 py-1.5 rounded-lg bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-slate-300 backdrop-blur-sm"
                >
                  #{tag.tag.name}
                </span>
              ))}
            </div>

            {/* Questions & Difficulty Info */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-5">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                <Target
                  className={`w-4 h-4 ${textColor}`
                    .replace("text-emerald-400", "text-emerald-600 dark:text-emerald-400")
                    .replace("text-amber-400", "text-amber-600 dark:text-amber-400")
                    .replace("text-rose-400", "text-rose-600 dark:text-rose-400")
                    .replace("text-violet-400", "text-violet-600 dark:text-violet-400")}
                />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {quiz._count.questions} Questions
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                <Layers
                  className={`w-4 h-4 ${textColor}`
                    .replace("text-emerald-400", "text-emerald-600 dark:text-emerald-400")
                    .replace("text-amber-400", "text-amber-600 dark:text-amber-400")
                    .replace("text-rose-400", "text-rose-600 dark:text-rose-400")
                    .replace("text-violet-400", "text-violet-600 dark:text-violet-400")}
                />
                <span
                  className={`text-sm font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r ${bgColor} bg-white`}
                >
                  {quiz.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
