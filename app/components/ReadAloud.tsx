// app/components/ReadAloudBox.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  /** Either pass text directly... */
  text?: string;
  /** ...or read innerText from this element id */
  targetId?: string;
  defaultRate?: number; // 0.5–1.5
};

export default function ReadAloudBox({
  text,
  targetId,
  defaultRate = 1,
}: Props) {
  // --- hydration guard ---
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // --- voices ---
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (!mounted) return;
    const synth = window.speechSynthesis;
    // force voices to load
    synth.getVoices();
    const onVoices = () => setVoices(synth.getVoices());
    synth.addEventListener?.("voiceschanged", onVoices);
    // also try a short timeout for Safari
    const t = setTimeout(onVoices, 100);
    return () => {
      synth.removeEventListener?.("voiceschanged", onVoices);
      clearTimeout(t);
    };
  }, [mounted]);

  // English-only options (fallback to all if empty)
  const options = useMemo(() => {
    const isEnglish = (v: SpeechSynthesisVoice) =>
      (v.lang || "").toLowerCase().replace("_", "-").startsWith("en") ||
      /english/i.test(v.name);
    const en = voices.filter(isEnglish);
    return en.length ? en : voices;
  }, [voices]);

  // selection + rate
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [rate, setRate] = useState(defaultRate);
  useEffect(() => {
    if (!options.length) return;
    const gb = options.findIndex((v) =>
      v.lang?.toLowerCase().startsWith("en-gb"),
    );
    const idx = gb >= 0 ? gb : Math.min(voiceIndex, options.length - 1);
    setVoiceIndex(Number.isFinite(idx) ? idx : 0);
  }, [options]); // eslint-disable-line react-hooks/exhaustive-deps

  // speaking state
  const [state, setState] = useState<"idle" | "speaking" | "paused">("idle");
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getText = () => {
    if (text) return text;
    if (targetId) {
      const el = document.getElementById(targetId);
      return el?.innerText?.trim() ?? "";
    }
    return "";
  };

  const speak = () => {
    const t = getText();
    if (!t || !options.length) return;
    stop();
    const u = new SpeechSynthesisUtterance(t);
    u.voice = options[voiceIndex];
    u.rate = rate;
    u.onstart = () => setState("speaking");
    u.onpause = () => setState("paused");
    u.onresume = () => setState("speaking");
    u.onend = () => setState("idle");
    u.onerror = () => setState("idle");
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  };

  const pause = () => {
    const s = window.speechSynthesis;
    if (s.speaking && !s.paused) s.pause();
  };
  const resume = () => {
    const s = window.speechSynthesis;
    if (s.paused) s.resume();
  };
  const stop = () => {
    window.speechSynthesis.cancel();
    utterRef.current = null;
    setState("idle");
  };

  // --- server placeholder to prevent hydration mismatch ---
  if (!mounted) {
    return (
      <div className="my-3 inline-flex items-center gap-2 border border-gray-200 bg-white p-3 text-sm w-fit">
        <label className="mr-1 font-medium">Voice</label>
        <select className="max-w-56 rounded border px-2 py-1" disabled>
          <option>Loading voices…</option>
        </select>
        <label className="ml-2 mr-1 font-medium">Rate</label>
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.1}
          value={defaultRate}
          readOnly
          className="w-28"
        />
        <span className="tabular-nums w-8 text-center">
          {defaultRate.toFixed(1)}×
        </span>
        <button
          className="rounded bg-gray-200 px-3 py-1.5 text-gray-800"
          disabled
        >
          Read
        </button>
      </div>
    );
  }

  // no API support?
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return (
      <p className="my-3 text-sm text-gray-500">
        Text-to-speech not supported in this browser.
      </p>
    );
  }

  return (
    <div className="my-3 inline-flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white p-3 text-sm w-fit max-w-full">
      <label className="mr-1 font-medium" htmlFor="voice">
        Voice
      </label>
      <select
        id="voice"
        className="max-w-56 truncate rounded border border-gray-300 px-2 py-1"
        value={voiceIndex}
        onChange={(e) => setVoiceIndex(Number(e.target.value))}
        title={options[voiceIndex]?.name}
      >
        {options.map((v, i) => (
          <option key={`${v.name}-${v.lang}-${i}`} value={i}>
            {v.name} ({v.lang})
          </option>
        ))}
      </select>

      <label className="ml-2 mr-1 font-medium" htmlFor="rate">
        Rate
      </label>
      <input
        id="rate"
        type="range"
        min={0.5}
        max={1.5}
        step={0.1}
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        className="w-28 align-middle"
      />
      <span className="tabular-nums w-8 text-center">{rate.toFixed(1)}×</span>

      <div className="flex items-center gap-2">
        {state === "idle" && (
          <button
            className="rounded bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700"
            onClick={speak}
            disabled={!options.length || !getText()}
          >
            Read
          </button>
        )}
        {state === "speaking" && (
          <>
            <button
              className="rounded bg-amber-500 px-3 py-1.5 font-medium text-white hover:bg-amber-600"
              onClick={pause}
            >
              Pause
            </button>
            <button
              className="rounded bg-gray-200 px-3 py-1.5 font-medium text-gray-800 hover:bg-gray-300"
              onClick={stop}
            >
              Stop
            </button>
          </>
        )}
        {state === "paused" && (
          <>
            <button
              className="rounded bg-green-600 px-3 py-1.5 font-medium text-white hover:bg-green-700"
              onClick={resume}
            >
              Resume
            </button>
            <button
              className="rounded bg-gray-200 px-3 py-1.5 font-medium text-gray-800 hover:bg-gray-300"
              onClick={stop}
            >
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}
