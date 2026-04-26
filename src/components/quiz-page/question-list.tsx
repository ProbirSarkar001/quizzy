"use client";

import { useEffect, useMemo } from "react";
import { Info, Circle, CheckCircle2, XCircle, Check } from "lucide-react";
import { QuestionType } from "@/queries/home-page";
import { useQuizStore } from "@/stores/quiz-store";
import { cn } from "@/lib/utils";
import { shuffle } from "es-toolkit/array";
import QuizProgressBar from "./progress-bar";
import QuizResults from "./quiz-results";

// Style constants
const buttonVariants = {
  base: "w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border shadow-sm text-sm sm:text-base transition-all",
  default: "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:shadow-md hover:bg-gray-50 dark:hover:bg-white/5",
  correct: "bg-green-50 dark:bg-green-900/30 border-green-500 text-green-900 dark:text-green-100",
  incorrect: "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-900 dark:text-red-100",
  showCorrect: "bg-green-50/70 dark:bg-green-900/20 border-green-400 text-green-900/90 dark:text-green-200",
  disabled: "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 opacity-60",
};

function AnswerIcon({ isPicked, isCorrect, answered }: { isPicked: boolean; isCorrect: boolean; answered: boolean }) {
  if (!answered) return <Circle className={cn("h-4 w-4 shrink-0 transition-all", isPicked && "fill-gray-900 dark:fill-gray-100")} />;
  if (isPicked) return isCorrect ? <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-500" /> : <XCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-500" />;
  if (isCorrect) return <Check className="h-4 w-4 shrink-0 text-green-500" />;
  return <Circle className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-600" />;
}

function AnswerButton({
  text,
  isPicked,
  isCorrect,
  answered,
  disabled,
  onClick
}: {
  text: string;
  isPicked: boolean;
  isCorrect: boolean;
  answered: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  let variant = buttonVariants.default;

  if (answered) {
    if (isPicked && isCorrect) variant = buttonVariants.correct;
    else if (isPicked && !isCorrect) variant = buttonVariants.incorrect;
    else if (isCorrect) variant = buttonVariants.showCorrect;
    else variant = buttonVariants.disabled;
  }

  return (
    <button
      type="button"
      className={cn(
        buttonVariants.base,
        variant,
        !answered && !disabled && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:focus-visible:ring-white/20",
        (!answered && disabled) && "cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flex items-center gap-3">
        <AnswerIcon isPicked={isPicked} isCorrect={isCorrect} answered={answered} />
        <span className="wrap-break-word">{text}</span>
      </span>
    </button>
  );
}

export default function QuizQuestions({ questions }: { questions: QuestionType[] }) {
  const setCurrentQuiz = useQuizStore((state) => state.setCurrentQuiz);
  const answers = useQuizStore((state) => state.answers);
  const showResults = useQuizStore((state) => state.showResults);
  const setAnswer = useQuizStore((state) => state.setAnswer);
  const reset = useQuizStore((state) => state.reset);

  const shuffledQuestions = useMemo(() => shuffle(questions), [questions]);

  useEffect(() => {
    setCurrentQuiz(shuffledQuestions);
  }, [shuffledQuestions, setCurrentQuiz]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <div id="questions" className="mx-auto max-w-7xl pb-32">
      <QuizProgressBar />
      <div className="px-4 sm:px-6 py-4 md:py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Quiz Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Answer all questions below and test your knowledge.
        </p>
      </div>
      <ol className="max-w-4xl pl-4 sm:pl-7 pr-4 sm:pr-6 space-y-6 sm:space-y-8">
        {shuffledQuestions.map((q, i) => (
          <li key={q.id}>
            <QuestionCard q={q} index={i} selected={answers[i]} onAnswer={setAnswer} showResult={showResults} />
          </li>
        ))}
      </ol>
      <QuizResults />
    </div>
  );
}

function QuestionCard({
  q,
  index,
  selected,
  onAnswer,
  showResult
}: {
  q: QuestionType;
  index: number;
  selected?: number;
  onAnswer?: (questionIndex: number, answerIndex: number) => void;
  showResult?: boolean;
}) {
  const isAnswered = selected !== undefined && selected !== null;
  const isDisabled = isAnswered || !!showResult;

  return (
    <div className="relative rounded-3xl sm:rounded-4xl border border-white/10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-5 sm:p-10">
      <div className="absolute -left-3 -top-3 sm:-left-4 sm:-top-4 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-500 blur-lg opacity-40" />
          <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-black text-sm sm:text-lg shadow-xl border border-white/20 transform -rotate-6">
            {index + 1}
          </div>
        </div>
      </div>

      <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-4 sm:mb-8 pr-1 leading-snug sm:leading-tight tracking-tight wrap-break-word">
        {q.text}
      </h2>

      <fieldset className="space-y-2">
        <legend className="sr-only">Question {index + 1}</legend>
        {q.options.map((opt, i) => (
          <AnswerButton
            key={i}
            text={opt}
            isPicked={selected === i}
            isCorrect={i === q.correctIndex}
            answered={isAnswered || !!showResult}
            disabled={isDisabled}
            onClick={() => !isDisabled && onAnswer?.(index, i)}
          />
        ))}
      </fieldset>

      {isAnswered && q.explanation && (
        <div className="mt-3 sm:mt-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/5 px-3 sm:px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 shrink-0" />
            <span>{q.explanation}</span>
          </div>
        </div>
      )}
    </div>
  );
}
