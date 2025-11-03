"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = { src: string };

export default function AudioPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  // mm:ss formatter
  const fmt = (s: number) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const ss = String(Math.floor(s % 60)).padStart(2, "0");
    return `${m}:${ss}`;
  };

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrent(audio.currentTime || 0);
    const onEnd = () => {
      setIsPlaying(false);
      setCurrent(0);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audioRef.current = null;
    };
  }, [src]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  };

  const onSeek: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrent(t);
  };

  return (
    <div className="max-w-md rounded-2xl border border-gray-200 bg-white/90 p-3 shadow-sm mt-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-lg ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>

        <h2 className="flex-1 truncate text-sm font-mono text-gray-900">
          Hello World
        </h2>

        <div className="text-[11px] font-mono tabular-nums text-gray-500">
          {fmt(current)} / {fmt(duration)}
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={current}
        step="0.01"
        onChange={(e) => {
          const t = Number(e.target.value);
          if (audioRef.current) audioRef.current.currentTime = t;
          setCurrent(t);
        }}
        disabled={!duration}
        aria-label="Seek"
        className="mt-2 w-full accent-indigo-600 disabled:opacity-40"
      />
    </div>
  );
}
