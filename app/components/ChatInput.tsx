"use client";

import { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onboardingComplete: boolean;
  disabled?: boolean; // e.g. isLoading from parent
  onSend: (text: string) => void | Promise<void>;
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

    await onSend(trimmed);
    setInput("");
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
    <form onSubmit={handleSubmit} className="mt-4 flex items-end gap-2">
      {/* Text area + camera + mic */}
      <div className="flex flex-1 items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          className="bg-white min-h-12 w-full flex-1 rounded-md border border-gray-300 px-3 py-6 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={
            onboardingComplete
              ? "⌨  Type your question or 💬 describe what you’d like help writing…"
              : "⌨  Type your answer here…"
          }
        />

        <div className="flex flex-col gap-2">
          {/* Camera / document photo */}
          <button
            type="button"
            onClick={handleOpenCamera}
            disabled={disabled}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span aria-hidden="true">📷</span>
            <span className="sr-only">Upload a photo of a document</span>
          </button>

          {/* Speech to text */}
          <button
            type="button"
            onClick={handleToggleRecording}
            disabled={disabled}
            className={`flex h-10 w-10 items-center justify-center rounded-md border text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
              isRecording
                ? "border-red-500 bg-red-50 text-red-700"
                : "border-gray-300 bg-white hover:bg-gray-100"
            }`}
          >
            <span aria-hidden="true">{isRecording ? "⏹️" : "🎤"}</span>
            <span className="sr-only">
              {isRecording ? "Stop dictation" : "Start dictation"}
            </span>
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Send button */}
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="self-end rounded-md bg-blue-600 px-5 py-9 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Send
      </button>
    </form>
  );
}
