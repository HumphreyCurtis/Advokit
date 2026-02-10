"use client";

import { useEffect, useRef, useState } from "react";

type InputMode = "typed" | "speech" | "unknown";

interface ChatInputProps {
  onboardingComplete: boolean;
  disabled?: boolean; // e.g. isLoading from parent
  onSend: (text: string, mode: InputMode) => void | Promise<void>;
}

type SimpleSpeechRecognitionEvent = {
  results: SpeechRecognitionResult[]; // TS already knows this type
};

export default function ChatInput({
  onboardingComplete,
  disabled = false,
  onSend,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null); // keep simple for now

  const lastInputModeRef = useRef<InputMode>("unknown");

  // Speech recognition setup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-GB";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SimpleSpeechRecognitionEvent) => {
      const firstResult = event.results[0];
      const firstAlternative = firstResult[0]; // SpeechRecognitionAlternative
      const transcript = firstAlternative.transcript;

      lastInputModeRef.current = "speech"; // ✅ mark that speech contributed

      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = (event: unknown) => {
      console.error("Speech recognition error", event);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;

    const mode = lastInputModeRef.current ?? "unknown";
    await onSend(trimmed, mode);

    setInput("");
    lastInputModeRef.current = "unknown"; // reset for next message
  }

  function handleToggleRecording() {
    if (disabled) return;

    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      setIsRecording(true);
      recognition.start();
    }
  }

  function handleOpenCamera() {
    if (disabled) return;
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, just log it – later you can send to OCR and insert text.
    console.log("Selected document image:", file);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-1 flex items-end gap-2">
      {/* Left: textarea */}
      <textarea
        value={input}
        onChange={(e) => {
          lastInputModeRef.current = "typed";
          setInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // stop newline
            // trigger the same submit logic
            // (guard against disabled / empty inside handleSubmit already)
            handleSubmit(e as unknown as React.FormEvent);
          }
        }}
        rows={2}
        className="min-h-12 flex-1 resize-none rounded-md border border-gray-300 bg-white px-3 py-5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={
          onboardingComplete
            ? "⌨ Ask your question or describe what you’d like to draft…"
            : "⌨ Type your answer here…"
        }
      />

      {/* Right: actions (mic + send) */}
      <div className="flex flex-col gap-2">
        {/* Mic */}
        <button
          type="button"
          onClick={handleToggleRecording}
          disabled={disabled}
          className={`flex h-10 w-10 items-center justify-center rounded-md border text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
            isRecording
              ? "border-red-500 bg-red-50 text-red-700"
              : "border-gray-300 bg-white hover:bg-gray-100"
          }`}
          aria-label={isRecording ? "Stop dictation" : "Start dictation"}
        >
          <span aria-hidden="true">{isRecording ? "⏹️" : "🎤"}</span>
        </button>

        {/* Send */}
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 text-lg font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          aria-label="Send"
          title="Send"
        >
          <span aria-hidden="true">➡️</span>
        </button>
      </div>
    </form>
  );
}
