"use client";

import { useState } from "react";
import { ReadAloud } from "../components/ReadAloud";
import ChatInput from "../components/ChatInput";

type Role = "user" | "assistant" | "system";

interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

interface CaseContext {
  benefitName?: string;
  claimStage?: string;
  conditions?: string;
  dailyImpact?: string;
  stylePreference?: "simple" | "detailed";
}

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
  {
    id: "stylePreference",
    prompt:
      "✍️ How would you like me to write suggestions: in simple short sentences, or longer detailed explanations?",
    helper: 'You can say "simple" or "detailed".',
  },
];

function normaliseStylePreference(
  input: string,
): CaseContext["stylePreference"] {
  const t = input.toLowerCase();
  if (t.includes("simple") || t.includes("short")) return "simple";
  if (t.includes("detail")) return "detailed";
  return undefined;
}

export default function ClaimHelperChat() {
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

  const [caseContext, setCaseContext] = useState<CaseContext>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    // Phase 1: collect onboarding questions
    if (!onboardingComplete) {
      handleOnboardingAnswer(trimmed);
      return;
    }

    // Phase 2: normal chat with backend
    await sendToBackend(
      [...messages, newUserMessage],
      caseContext,
      setMessages,
      setIsLoading,
    );
  }

  function handleOnboardingAnswer(answer: string) {
    const currentQ = onboardingQuestions[currentQuestionIndex];

    setCaseContext((prev) => {
      const updated: CaseContext = { ...prev };

      if (currentQ.id === "stylePreference") {
        updated.stylePreference =
          normaliseStylePreference(answer) ?? prev.stylePreference;
      } else if (currentQ.id === "conditions") {
        updated.conditions = answer;
      } else if (currentQ.id === "dailyImpact") {
        updated.dailyImpact = answer;
      } else if (currentQ.id === "benefitName") {
        updated.benefitName = answer;
      } else if (currentQ.id === "claimStage") {
        updated.claimStage = answer;
      }

      return updated;
    });

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < onboardingQuestions.length) {
      const nextQuestion = onboardingQuestions[nextIndex];

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
      // Onboarding complete
      setOnboardingComplete(true);

      const summary = buildCaseSummary({
        ...caseContext,
        // include last answer too (state update is async, so we add it manually)
        ...(currentQ.id === "stylePreference"
          ? { stylePreference: normaliseStylePreference(answer) }
          : currentQ.id === "conditions"
            ? { conditions: answer }
            : currentQ.id === "dailyImpact"
              ? { dailyImpact: answer }
              : currentQ.id === "benefitName"
                ? { benefitName: answer }
                : currentQ.id === "claimStage"
                  ? { claimStage: answer }
                  : {}),
      });

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

  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    if (!onboardingComplete) {
      handleOnboardingAnswer(trimmed);
      return;
    }

    await sendToBackend(
      [...messages, newUserMessage],
      caseContext,
      setMessages,
      setIsLoading,
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-6">
      {/* Safety banner */}
      <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        <strong>⚠️ Safety note:</strong> Please do not share National Insurance
        numbers, full addresses, bank details, passwords, or other personal
        details. Describe your situation in general terms.
      </div>
      {/* Chat window */}
      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border bg-white p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm md:text-base ${
                m.role === "user"
                  ? "bg-purple-300 text-white"
                  : m.role === "assistant"
                    ? "bg-gray-100 text-gray-900"
                    : "bg-gray-200 text-gray-800"
              }`}
            >
              <ReadAloud text={m.content} buttonLabel={""} />
            </div>
          </div>
        ))}
        {isLoading && <div className="text-sm text-gray-500">Thinking…</div>}
      </div>
      {/* Input */}
      <ChatInput
        onboardingComplete={onboardingComplete}
        disabled={isLoading}
        onSend={handleSend}
      />
    </main>
  );
}

function buildCaseSummary(ctx: CaseContext): string {
  const lines: string[] = [];

  if (ctx.benefitName) {
    lines.push(`• Benefit: ${ctx.benefitName}`);
  }
  if (ctx.claimStage) {
    lines.push(`• Claim stage: ${ctx.claimStage}`);
  }
  if (ctx.conditions) {
    lines.push(`• Conditions: ${ctx.conditions}`);
  }
  if (ctx.dailyImpact) {
    lines.push(`• Impact on daily life: ${ctx.dailyImpact}`);
  }
  if (ctx.stylePreference) {
    lines.push(
      `• Writing style preference: ${ctx.stylePreference === "simple" ? "simple, short sentences" : "more detailed explanations"}`,
    );
  }

  if (lines.length === 0) {
    return "No case details recorded yet.";
  }

  return lines.join("\n");
}

// This is just a stub. You will later connect it to your LLM API.
async function sendToBackend(
  messages: ChatMessage[],
  caseContext: CaseContext,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsLoading: (v: boolean) => void,
) {
  try {
    setIsLoading(true);

    console.log("[client] Sending to API", { messages, caseContext });

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, caseContext }),
    });

    if (!res.ok) {
      throw new Error("Request failed");
    }

    const data = await res.json();

    console.log("[client] API response", data);

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: data.reply ?? "Sorry, I couldn't generate a reply.",
    };

    setMessages((prev) => [...prev, assistantMessage]);
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, something went wrong while generating a reply.",
      },
    ]);
  } finally {
    setIsLoading(false);
  }
}

// <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
//   <textarea
//     value={input}
//     onChange={(e) => setInput(e.target.value)}
//     rows={2}
//     className="min-h-12 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
//     placeholder={
//       onboardingComplete
//         ? "💬 Type your question or describe what you’d like help writing…"
//         : "⌨  Type your answer here…"
//     }
//   />
//   <button
//     type="submit"
//     disabled={isLoading || !input.trim()}
//     className="self-end rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
//   >
//     Send
//   </button>
// </form>
