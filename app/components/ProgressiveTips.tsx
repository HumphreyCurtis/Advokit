"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Section } from "../types";
import { ReadAloud } from "@/app/components/ReadAloud";

function toYouTubeEmbed(raw?: string): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.hostname.includes("youtu.be"))
      return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v"))
      return `https://www.youtube-nocookie.com/embed/${u.searchParams.get("v")}`;
    return null;
  } catch {
    return null;
  }
}

export default function ProgressiveTips({
  sections,
  startIndex = 0,
  onIndexChangeAction,
  title = "Tips",
}: {
  sections: Section[];
  startIndex?: number;
  onIndexChangeAction?: (idx: number) => void;
  title?: string;
}) {
  const total = sections.length;
  const [idx, setIdx] = useState(() =>
    Math.min(Math.max(startIndex, 0), Math.max(total - 1, 0)),
  );

  useEffect(() => {
    onIndexChangeAction?.(idx);
  }, [idx, onIndexChangeAction]);

  const go = useCallback(
    (n: number) => setIdx((i) => Math.min(Math.max(n, 0), total - 1)),
    [total],
  );
  const prev = useCallback(() => go(idx - 1), [idx, go]);
  const next = useCallback(() => go(idx + 1), [idx, go]);
  const first = useCallback(() => go(0), [go]);
  const last = useCallback(() => go(total - 1), [go, total]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        first();
      } else if (e.key === "End") {
        e.preventDefault();
        last();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, first, last]);

  const current = sections[idx];
  const embed = useMemo(() => toYouTubeEmbed(current?.youtubeVideo), [current]);

  if (!total) return null;

  return (
    <section
      aria-label={title}
      className="rounded-2xl border border-gray-200 bg-white/90 px-3 pb-3 pt-1 shadow-sm backdrop-blur"
    >
      <div className="mb-2 mt-3 flex items-center gap-3">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 shrink-0">
          {title}: {idx + 1}/{total}
        </h2>

        <div className="flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${((idx + 1) / total) * 100}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* <div className="flex items-center">
        <ReadAloud targetId="tip-content" defaultRate={1} />
      </div>
      <div
        role="group"
        aria-labelledby={`tip-${current.id}-title`}
        className="rounded-xl border border-gray-200 bg-white p-4"
      >
        <div id="tip-content">
          <h3
            id={`tip-${current.id}-title`}
            className="mb-2 text-2xl font-semibold text-gray-800 text-center"
          >
            {current.title}
          </h3>

          <p className="mb-4 text-xl text-gray-800 leading-relaxed">
            {current.body}
          </p>
        </div> */}

      <div
        role="group"
        aria-labelledby={`tip-${current.id}-title`}
        className="rounded-xl border border-gray-200 bg-white p-4"
      >
        <h3
          id={`tip-${current.id}-title`}
          className="mb-2 text-2xl font-semibold text-gray-800 text-center"
        >
          {current.title}
        </h3>

        {/* Button + highlighted body */}
        <ReadAloud
          text={`${current.title}. ${current.body}`}
          defaultRate={1}
          buttonLabel="Read this tip"
        />
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={idx === 0}
            className="rounded-2xl px-8 py-4 text-2xl font-bold
                 bg-red-600 text-white shadow-md
                 hover:bg-red-700 active:scale-[0.98]
                 disabled:bg-red-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            ← Prev
          </button>
        </div>

        {/* Dots */}
        <ol className="hidden sm:flex items-center gap-2" aria-label="Steps">
          {sections.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to tip ${i + 1}`}
                className={`h-3 w-3 rounded-full ring-1 ring-gray-300 transition ${
                  i === idx ? "bg-blue-600" : "bg-gray-200 hover:bg-gray-300"
                }`}
              />
            </li>
          ))}
        </ol>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={next}
            disabled={idx === total - 1}
            className="rounded-2xl px-8 py-4 text-2xl font-bold
                 bg-green-600 text-white shadow-md
                 hover:bg-green-700 active:scale-[0.98]
                 disabled:bg-green-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
