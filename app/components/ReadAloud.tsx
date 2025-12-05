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
            className={isActive ? "bg-yellow-200 rounded-sm px-0.5" : ""}
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

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    if (!text.trim()) return;

    // Stop any existing utterance + timer
    window.speechSynthesis.cancel();
    clearTimer();

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.rate = defaultRate;

    const words = text.split(/\s+/).filter(Boolean);
    const wordMatches = [...text.matchAll(/\S+/g)];
    let boundaryWordIndex = 0;
    let gotBoundary = false;

    const startFallbackTimer = () => {
      const wordCount = words.length || 1;
      // Faster default so it keeps up better
      const baseMsPerWord = 180;
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

      // If no boundary events arrive, fall back to timer
      window.setTimeout(() => {
        if (!gotBoundary && timerRef.current === null) {
          startFallbackTimer();
        }
      }, 400);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      gotBoundary = true;
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

  // Safety: clear on unmount
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
