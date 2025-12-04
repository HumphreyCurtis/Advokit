"use client";

import { useMemo, useRef, useState, useEffect } from "react";

const DEMO_TEXT =
  "This is a simple example of read-along text. Each word will be highlighted as it is spoken.";

// Highlights the current word based on *word index* (not char index)
function ReadAlongText({
  text,
  currentWordIndex,
}: {
  text: string;
  currentWordIndex: number | null;
}) {
  // Split into words + spaces so spacing is preserved
  const chunks = useMemo(() => text.split(/(\s+)/), [text]);

  let wordCounter = 0;

  return (
    <p className="text-lg leading-relaxed">
      {chunks.map((chunk, i) => {
        const isWord = /\S/.test(chunk);
        let isActive = false;

        if (isWord) {
          const thisWordIndex = wordCounter;
          wordCounter += 1;
          isActive = currentWordIndex === thisWordIndex;
        }

        return (
          <span key={i} className={isActive ? "bg-yellow-200 rounded-sm" : ""}>
            {chunk}
          </span>
        );
      })}
    </p>
  );
}

export default function ReadAlong() {
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timerRef = useRef<number | null>(null);

  const text = DEMO_TEXT;

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
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

    // Optional: adjust rate if you like
    // utterance.rate = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentWordIndex(0);

      // Basic heuristic: time per word
      const words = text.split(/\s+/).filter(Boolean);
      const wordCount = words.length || 1;

      // Rough estimate: ~300ms per word at rate 1
      const baseMsPerWord = 300;
      const estMsPerWord = baseMsPerWord / utterance.rate;

      let wIndex = 0;

      timerRef.current = window.setInterval(() => {
        wIndex += 1;
        if (wIndex >= wordCount) {
          clearTimer();
          return;
        }
        setCurrentWordIndex(wIndex);
      }, estMsPerWord) as unknown as number;
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

  const handleStop = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    clearTimer();
    setIsSpeaking(false);
    setCurrentWordIndex(null);
  };

  // Safety: clear timer if component unmounts
  useEffect(() => {
    return () => {
      clearTimer();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">
        Read-along Demo
      </h1>

      <ReadAlongText text={text} currentWordIndex={currentWordIndex} />

      <div className="mt-4 flex gap-2">
        {!isSpeaking && (
          <button
            onClick={handleSpeak}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            🔊 Read aloud
          </button>
        )}

        {isSpeaking && (
          <button
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
