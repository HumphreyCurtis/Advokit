// app/components/useSpeech.ts
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type SpeechState = "idle" | "speaking" | "paused";

export function useSpeech() {
  const synth =
    typeof window !== "undefined" ? window.speechSynthesis : undefined;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [state, setState] = useState<SpeechState>("idle");
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const supported = !!synth;

  useEffect(() => {
    if (!synth) return;
    const loadVoices = () => setVoices(synth.getVoices());
    loadVoices();
    synth.addEventListener?.("voiceschanged", loadVoices);
    return () => synth.removeEventListener?.("voiceschanged", loadVoices);
  }, [synth]);

  const speak = (
    text: string,
    opts?: { voice?: SpeechSynthesisVoice; rate?: number; pitch?: number },
  ) => {
    if (!synth) return;
    stop();
    const u = new SpeechSynthesisUtterance(text);
    if (opts?.voice) u.voice = opts.voice;
    if (opts?.rate) u.rate = opts.rate;
    if (opts?.pitch) u.pitch = opts.pitch;

    u.onstart = () => setState("speaking");
    u.onpause = () => setState("paused");
    u.onresume = () => setState("speaking");
    u.onend = () => setState("idle");
    u.onerror = () => setState("idle");

    currentUtterance.current = u;
    synth.speak(u);
  };

  const pause = () => {
    if (synth?.speaking && !synth.paused) synth.pause();
  };
  const resume = () => {
    if (synth?.paused) synth.resume();
  };
  const stop = () => {
    if (!synth) return;
    synth.cancel();
    currentUtterance.current = null;
    setState("idle");
  };

  return { supported, voices, state, speak, pause, resume, stop };
}
