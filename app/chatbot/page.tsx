"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ReadAloud } from "../components/ReadAloud";
import ChatInput from "../components/ChatInput";
import { Participant } from "../types";

type Role = "user" | "assistant" | "system";

// Shape of a chat message
interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

// Context collected during onboarding and sent to backend
interface CaseContext {
  benefitName?: string;
  claimStage?: string;
  conditions?: string;
  dailyImpact?: string;
}

// Fixed onboarding flow shown before free chat
interface OnboardingQuestion {
  id: keyof CaseContext | "conditions" | "dailyImpact";
  prompt: string;
  helper?: string;
}

const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: "benefitName",
    prompt:
      "📃 Which disability benefit are you applying for (e.g. PIP, ESA, Universal Credit, other)?",
  },
  {
    id: "claimStage",
    prompt:
      "📅 What stage are you at (first application, reconsideration, appeal, or not sure)?",
  },
  {
    id: "conditions",
    prompt:
      "❤️‍🩹 Briefly describe your main health conditions (for example: stroke with aphasia, plus anything else).",
  },
  {
    id: "dailyImpact",
    prompt:
      "🧩 How do these conditions affect your day-to-day life? You can mention things like communication, understanding information, moving around, washing, dressing, cooking, etc.",
  },
];

// Simple unique ID generator for messages
function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function ClaimHelperChat() {
  // MongoDB databasing
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [showGate, setShowGate] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("advokit_participant");
    if (raw) {
      setParticipant(JSON.parse(raw));
      setShowGate(false);
    }
  }, []);

  function startAnonymous() {
    const p = {
      participantId: crypto.randomUUID(),
      mode: "anonymous",
      consentedAtISO: new Date().toISOString(),
    } satisfies Participant;

    localStorage.setItem("advokit_participant", JSON.stringify(p));
    setParticipant(p);
    setShowGate(false);
  }

  function startNamed(name: string) {
    const clean = name.trim().slice(0, 60);
    const p = {
      participantId: crypto.randomUUID(),
      displayName: clean || undefined,
      mode: clean ? "named" : "anonymous",
      consentedAtISO: new Date().toISOString(),
    } satisfies Participant;

    localStorage.setItem("advokit_participant", JSON.stringify(p));
    setParticipant(p);
    setShowGate(false);
  }

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro-1",
      role: "assistant",
      content:
        "👋 Hello, I’m the Advokit claim helper. I can help you think through your situation and draft clear wording for your disability benefit claim.",
    },
    {
      id: "intro-2",
      role: "assistant",
      content:
        "⚠️ Important: please do NOT share very sensitive details such as your National Insurance number, full home address, bank details, or passwords. You only need to describe your situation in general terms.",
    },
    {
      id: "intro-3",
      role: "assistant",
      content:
        "🙋 To start, I’ll ask a few short questions about your benefit and your situation. Then we can work together on specific answers 💬 for your form or appeal.",
    },
    {
      id: "q-0",
      role: "assistant",
      content: onboardingQuestions[0].prompt,
    },
  ]);

  // Keep a ref to the latest messages array
  // This avoids stale state when sending messages asynchronously
  const messagesRef = useRef<ChatMessage[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const [caseContext, setCaseContext] = useState<CaseContext>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const hasAssistantMessage = useMemo(
    () => messages.some((m) => m.role === "assistant"),
    [messages],
  );

  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }

  // Handles *all* user input (typed text and button-triggered commands)
  async function handleSend(text: string) {
    if (!participant) return;

    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const newUserMessage: ChatMessage = {
      id: uid("user"),
      role: "user",
      content: trimmed,
    };

    // Add user message immediately
    setMessages((prev) => {
      console.log("[chat] +user", newUserMessage);
      return [...prev, newUserMessage];
    });

    // Onboarding phase
    if (!onboardingComplete) {
      handleOnboardingAnswer(trimmed);
      return;
    }

    // Normal chat phase
    const nextMessages = [...messagesRef.current, newUserMessage];
    await sendToBackend(nextMessages, caseContext, setMessages, setIsLoading);
  }

  // Records onboarding answers and advances the question flow
  function handleOnboardingAnswer(answer: string) {
    const currentQ = onboardingQuestions[currentQuestionIndex];
    console.log("Onboarding Question Triggered");

    const updatedCtx: CaseContext = {
      ...caseContext,
      ...(currentQ.id === "conditions"
        ? { conditions: answer }
        : currentQ.id === "dailyImpact"
          ? { dailyImpact: answer }
          : currentQ.id === "benefitName"
            ? { benefitName: answer }
            : currentQ.id === "claimStage"
              ? { claimStage: answer }
              : {}),
    };

    setCaseContext(updatedCtx);

    const nextIndex = currentQuestionIndex + 1;

    // Ask the next onboarding question
    if (nextIndex < onboardingQuestions.length) {
      const nextQuestion = onboardingQuestions[nextIndex];
      console.log(nextQuestion);

      setCurrentQuestionIndex(nextIndex);

      setMessages((prev) => [
        ...prev,
        {
          id: `q-${nextIndex}`,
          role: "assistant",
          content:
            nextQuestion.prompt +
            (nextQuestion.helper ? " " + nextQuestion.helper : ""),
        },
      ]);
    } else {
      // Onboarding finished: show summary and transition to free chat
      setOnboardingComplete(true);

      const summary = buildCaseSummary(updatedCtx);

      setMessages((prev) => [
        ...prev,
        {
          id: "onboard-complete",
          role: "assistant",
          content:
            "✅ Thank you. Here is a short summary of what you’ve told me. I’ll use this to tailor my suggestions:",
        },
        {
          id: "case-summary",
          role: "assistant",
          content: `📋 Summary:\n${summary}`,
        },
        {
          id: "next-step",
          role: "assistant",
          content:
            '💬 You can now ask for help with specific questions on your form or appeal. For example, you might say: "Help me write about how my communication is affected".',
        },
      ]);
    }
  }

  return (
    <main className="bg-advokit-page text-gray-900">
      {showGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
            <h2 className="text-lg font-semibold">
              Continue anonymously, or enter a name?
            </h2>

            <p className="mt-2 text-sm text-gray-700">
              We are storing your chat interactions for research. Please don’t
              include highly sensitive personal details.
            </p>

            <div className="mt-4 space-y-3">
              <button
                className="w-full rounded-md bg-gray-900 px-4 py-2 text-white"
                onClick={startAnonymous}
              >
                Continue anonymously
              </button>

              <div>
                <label className="text-sm font-medium">Name (optional)</label>
                <input
                  id="participant-name"
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  placeholder="e.g. Sam"
                />

                <button
                  className="mt-2 w-full rounded-md border px-4 py-2"
                  onClick={() => {
                    const el = document.getElementById(
                      "participant-name",
                    ) as HTMLInputElement | null;
                    startNamed(el?.value ?? "");
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-6">
        {/* Safety banner */}
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <strong>⚠️ Safety note:</strong> Please do not share National
          Insurance numbers, full addresses, bank details, passwords, or other
          personal details. Describe your situation in general terms.
        </div>

        {/* Chat window */}
        <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border bg-white p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[90%] min-w-40 rounded-2xl px-4 py-3 text-sm md:text-base ${
                  m.role === "user"
                    ? "bg-teal-600 text-white"
                    : m.role === "assistant"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-gray-200 text-gray-800"
                }`}
              >
                {/* Copy button */}
                <button
                  type="button"
                  onClick={() => handleCopy(m.id, m.content)}
                  className="absolute left-2 bottom-3 rounded-lg px-2 py-1 text-sm font-semibold bg-white text-gray-900 border border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-blue-600 focus:ring-offset-2"
                  aria-label="Copy message text"
                >
                  {copiedId === m.id ? "✅" : "📋"}
                </button>

                {/* Message content */}
                <ReadAloud text={m.content} buttonLabel={""} />
              </div>
            </div>
          ))}
          {isLoading && <div className="text-lg text-gray-500">Thinking…</div>}
        </div>

        {/* Controls row aligned with input */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isLoading || !onboardingComplete || !hasAssistantMessage}
            onClick={() =>
              handleSend(
                "Good response ✅ -- lets see another answer in this style.",
              )
            }
            className="rounded-md border border-green-300 bg-green-50 px-3 py-2 text-m text-green-800 hover:bg-green-100 disabled:opacity-50"
          >
            👍 Good response
          </button>

          <button
            type="button"
            disabled={isLoading || !onboardingComplete || !hasAssistantMessage}
            onClick={() =>
              handleSend(
                "Bad response — try again with a different approach and wording. Rewrite the previous answer.",
              )
            }
            className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-m text-red-800 hover:bg-red-100 disabled:opacity-50"
          >
            👎 Bad response ↺
          </button>

          <button
            type="button"
            disabled={isLoading || !onboardingComplete || !hasAssistantMessage}
            onClick={() =>
              handleSend(
                "More detail — expand the previous answer. Add 2–4 more short paragraphs and one concrete example.",
              )
            }
            className="rounded-md border border-blue-300 bg-blue-50 px-3 py-2 text-m text-blue-800 hover:bg-blue-100 disabled:opacity-50"
          >
            📘 More detail
          </button>

          <button
            type="button"
            disabled={isLoading || !onboardingComplete || !hasAssistantMessage}
            onClick={() =>
              handleSend(
                "Less detail — shorten the previous answer. Keep 1 short paragraph + up to 3 bullet points.",
              )
            }
            className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-m text-gray-800 hover:bg-gray-100 disabled:opacity-50"
          >
            📄 Less detail
          </button>
        </div>

        {/* Input */}
        <ChatInput
          onboardingComplete={onboardingComplete}
          disabled={isLoading}
          onSend={handleSend}
        />
      </div>
    </main>
  );
}

// Builds a readable summary of the collected case context
function buildCaseSummary(ctx: CaseContext): string {
  const lines: string[] = [];
  if (ctx.benefitName) lines.push(`• Benefit: ${ctx.benefitName}`);
  if (ctx.claimStage) lines.push(`• Claim stage: ${ctx.claimStage}`);
  if (ctx.conditions) lines.push(`• Conditions: ${ctx.conditions}`);
  if (ctx.dailyImpact) lines.push(`• Impact on daily life: ${ctx.dailyImpact}`);
  return lines.length ? lines.join("\n") : "No case details recorded yet.";
}

// Sends the full conversation + context to the backend API
async function sendToBackend(
  messages: ChatMessage[],
  caseContext: CaseContext,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsLoading: (v: boolean) => void,
) {
  try {
    setIsLoading(true);

    // Logging everything to the console
    const payload = { messages, caseContext };

    console.log(
      "[client → api/chatbot] payload",
      JSON.stringify(payload, null, 2),
    );

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, caseContext }),
    });

    if (!res.ok) throw new Error("Request failed");

    const data = await res.json();

    console.log("[client] API reply >>>", data.reply);

    const assistantMessage: ChatMessage = {
      id: uid("assistant"),
      role: "assistant",
      content: data.reply ?? "Sorry, I couldn't generate a reply.",
    };

    setMessages((prev) => [...prev, assistantMessage]);
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      {
        id: uid("error"),
        role: "assistant",
        content: "Sorry, something went wrong while generating a reply.",
      },
    ]);
  } finally {
    setIsLoading(false);
  }
}
