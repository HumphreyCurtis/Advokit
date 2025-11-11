"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Section } from "../types";
import ReadAloud from "@/app/components/ReadAloud";

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
      className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {title}
        </h2>
        <div className="text-sm text-gray-600">
          Tip {idx + 1} of {total}
        </div>
      </div>
      {/* Progress bar */}
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${((idx + 1) / total) * 100}%` }}
          aria-hidden="true"
        />
      </div>
      {/* Read aloud just below header */}
      <div className="mb-3 flex justify-left">
        <ReadAloud targetId="tip-content" defaultRate={1} />
      </div>
      {/* Slide */}
      <div
        role="group"
        aria-labelledby={`tip-${current.id}-title`}
        className="rounded-xl border border-gray-200 bg-white p-4"
      >
        <div id="tip-content">
          <h3
            id={`tip-${current.id}-title`}
            className="mb-2 text-3xl font-semibold text-gray-800 text-center"
          >
            {current.title}
          </h3>

          <p className="mb-4 text-xl text-gray-800 leading-relaxed">
            {current.body}
          </p>
        </div>

        {/* Figure (optional, single) */}
        {current.figure && (
          <figure className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img
              src={current.figure}
              alt={current.figureCaption}
              loading="lazy"
              className="h-auto w-full object-contain"
            />
            {current.figureCaption && (
              <figcaption className="px-3 py-2 text-xs text-gray-600">
                {current.figureCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Media (optional) */}
        {current.audio && (
          <figure className="mb-4">
            <figcaption className="mb-1 text-xs text-gray-600">
              {current.audioCaption ?? "Audio"}
            </figcaption>
            <audio controls className="w-full">
              <source src={current.audio} />
              Your browser does not support the audio element.
            </audio>
          </figure>
        )}

        {embed && (
          <div className="aspect-video w-full overflow-hidden rounded-lg ring-1 ring-gray-200">
            <iframe
              src={embed}
              title={current.title ?? "YouTube video"}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </div>
      {/* Controls */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={first}
            disabled={idx === 0}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-40"
          >
            ⏮ First
          </button>
          <button
            type="button"
            onClick={prev}
            disabled={idx === 0}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-40"
          >
            ← Prev
          </button>
        </div>
        {/* Dots */}
        <ol className="hidden sm:flex items-center gap-1" aria-label="Steps">
          {sections.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to tip ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full ring-1 ring-gray-300 transition ${
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
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-40"
          >
            Next →
          </button>
          <button
            type="button"
            onClick={last}
            disabled={idx === total - 1}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-40"
          >
            Last ⏭
          </button>
        </div>
      </div>
    </section>
  );
}
