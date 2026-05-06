"use client";

import { Sparkles, Target, Layers, Trophy } from "lucide-react";
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
    <div className="relative overflow-hidden bg-gray-50 dark:bg-slate-950 pt-20 md:pt-24 pb-12 md:pb-16">
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
              <Sparkles className={`w-3.5 h-3.5 text-transparent bg-clip-text bg-gradient-to-r ${bgColor} bg-white`} />
              <span className="text-[10px] font-bold tracking-widest text-gray-700 dark:text-white/80 uppercase">
                {quiz.category?.name || "General"}
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight break-words"
            >
              {quiz.title}
            </h1>

            <p
              className="text-sm sm:text-base text-gray-600 dark:text-slate-400 max-w-2xl mb-5 leading-relaxed break-words"
            >
              {quiz.description || "Challenge yourself with this expertly curated quiz and see how you rank!"}
            </p>

            <div
              className="flex flex-wrap justify-center lg:justify-start gap-2"
            >
              {quiz.tags.map((tag, i) => (
                <span
                  key={tag.tagId}
                  className="px-3 py-1.5 rounded-lg bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-slate-300 backdrop-blur-sm"
                >
                  #{tag.tag.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right Side: Stats Panel */}
          <div
            className="w-full max-w-xs"
          >
            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-white/60 to-white/20 dark:from-white/10 dark:to-white/0 border border-gray-200 dark:border-white/10 backdrop-blur-2xl overflow-hidden shadow-xl dark:shadow-2xl">
              <div className="bg-white/80 dark:bg-slate-900/50 rounded-[1.8rem] p-4 sm:p-5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  Quiz Stats
                </h3>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 group hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center border border-violet-200 dark:border-violet-500/20">
                        <Target className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-slate-300">Questions</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{quiz._count.questions}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 group hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10`}
                      >
                        <Layers className={`w-4 h-4 ${textColor}`.replace('text-emerald-400', 'text-emerald-600 dark:text-emerald-400').replace('text-amber-400', 'text-amber-600 dark:text-amber-400').replace('text-rose-400', 'text-rose-600 dark:text-rose-400').replace('text-violet-400', 'text-violet-600 dark:text-violet-400')} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-slate-300">Difficulty</span>
                    </div>
                    <span
                      className={`text-xs font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${bgColor} bg-white`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => document.getElementById("questions")?.scrollIntoView({ behavior: "smooth" })}
                  className={`w-full mt-4 py-2 rounded-xl bg-gradient-to-r ${bgColor} text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all text-xs uppercase tracking-widest`}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
