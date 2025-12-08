"use client";

import { useMemo, useRef, useState, useEffect } from "react";

// Generic highlighter for a text string
function ReadAlongText({
  text,
  currentWordIndex,
}: {
  text: string;
  currentWordIndex: number | null;
}) {
  const chunks = useMemo(() => text.split(/(\s+)/), [text]);
  let wordCounter = 0;

  return (
    <p className="text-xl text-gray-800 leading-relaxed">
      {chunks.map((chunk, i) => {
        const isWord = /\S/.test(chunk);
        let isActive = false;

        if (isWord) {
          const thisWordIndex = wordCounter;
          wordCounter += 1;
          isActive = currentWordIndex === thisWordIndex;
        }

        return (
          <span
            key={i}
            className={`rounded-sm px-0.5 ${isActive ? "bg-yellow-200" : ""}`}
          >
            {chunk}
          </span>
        );
      })}
    </p>
  );
}

type ReadAloudProps = {
  text: string;
  defaultRate?: number;
  buttonLabel?: string;
};

export function ReadAloud({
  text,
  defaultRate = 0.9,
  buttonLabel = "Read aloud",
}: ReadAloudProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStop = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    clearTimer();
    setIsSpeaking(false);
    setCurrentWordIndex(null);
  };

  // 🔹 Helper: pick a *local* English voice if available, otherwise let browser default
  function getLocalEnglishVoice(): SpeechSynthesisVoice | null {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return null;
    }

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
 
    if (!voices.length) return null;

    // voices.forEach(v =>
    //   console.log(v.name, v.lang, "local:", v.localService)
    // );

    // Only consider local English voices
    const englishVoice = voices.filter(
      (v) =>
        v.lang &&
        v.lang.toLowerCase().startsWith("en")
    );

    console.log(englishVoice)

    if (englishVoice.length > 0) {
      return englishVoice[0];
    }

    // If no local English, don't force a cloud voice – let browser choose
    return null;
  }

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    if (!text.trim()) return;

    window.speechSynthesis.cancel();
    clearTimer();

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.rate = defaultRate;

    // 🔹 Try to use a local English voice, otherwise use browser default
    const voice = getLocalEnglishVoice();
    if (voice) {
      console.log(
        "[TTS] using voice:",
        voice.name,
        voice.lang,
        "local:",
        (voice as any).localService
      );
      utterance.voice = voice; // <-- safe: only local voices
    } else {
      console.log("[TTS] using browser default voice");
    }

    const words = text.split(/\s+/).filter(Boolean);
    const wordMatches = [...text.matchAll(/\S+/g)];
    let boundaryWordIndex = 0;
    let gotBoundary = false;

    const startFallbackTimer = () => {
      const wordCount = words.length || 1;
      const baseMsPerWord = 400;
      const estMsPerWord = baseMsPerWord / utterance.rate;

      let wIndex = 0;
      setCurrentWordIndex(0);

      timerRef.current = window.setInterval(() => {
        wIndex += 1;
        if (wIndex >= wordCount) {
          clearTimer();
          return;
        }
        setCurrentWordIndex(wIndex);
      }, estMsPerWord) as unknown as number;
    };

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentWordIndex(0);

      window.setTimeout(() => {
        if (!gotBoundary && timerRef.current === null) {
          console.log("[TTS] no boundaries; starting fallback timer");
          startFallbackTimer();
        }
      }, 400);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      console.log("[TTS] boundary", event.charIndex);
      gotBoundary = true;
      clearTimer();

      const charIndex = event.charIndex;
      if (charIndex == null) return;

      while (
        boundaryWordIndex + 1 < wordMatches.length &&
        wordMatches[boundaryWordIndex + 1].index! <= charIndex
      ) {
        boundaryWordIndex += 1;
      }

      setCurrentWordIndex(boundaryWordIndex);
    };

    const clearState = () => {
      clearTimer();
      setIsSpeaking(false);
      setCurrentWordIndex(null);
    };

    utterance.onend = clearState;
    utterance.onerror = clearState;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      clearTimer();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      <ReadAlongText text={text} currentWordIndex={currentWordIndex} />
      <div className="flex justify-end items-center">
        {!isSpeaking ? (
          <button
            type="button"
            onClick={handleSpeak}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            🔊 {buttonLabel}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
