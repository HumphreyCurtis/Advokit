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
    utterance.rate = 0.9;
    // Optional but can help Chrome: choose a voice + lang explicitly
    // const voices = window.speechSynthesis.getVoices();
    // const enVoice = voices.find(v => v.lang.startsWith("en"));
    // if (enVoice) utterance.voice = enVoice;
    // utterance.lang = enVoice?.lang ?? "en-US";

    const words = text.split(/\s+/).filter(Boolean);
    const wordMatches = [...text.matchAll(/\S+/g)]; // each match = a "word" with index
    let boundaryWordIndex = 0;
    let gotBoundary = false;

    const startFallbackTimer = () => {
      // Fallback: approximate timing if no boundaries are received
      const wordCount = words.length || 1;

      const baseMsPerWord = 280;
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

      // If we don't see any boundary events shortly after start,
      // assume this voice/platform doesn't support them and
      // fall back to the timer.
      window.setTimeout(() => {
        if (!gotBoundary && timerRef.current === null) {
          startFallbackTimer();
        }
      }, 400);
    };

    // Use real boundaries when the voice supports them
    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      gotBoundary = true;

      const charIndex = event.charIndex;
      if (charIndex == null) return;

      // Advance boundaryWordIndex until we hit the word that contains charIndex
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
