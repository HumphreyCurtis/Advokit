import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface CaseContext {
  benefitName?: string;
  claimStage?: string;
  conditions?: string;
  dailyImpact?: string;
  stylePreference?: "simple" | "detailed";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages?: ChatMessage[];
      caseContext?: CaseContext;
    };

    const { messages = [], caseContext = {} } = body;

    const lastMessage = messages[messages.length - 1];

    // TODO: call your chosen LLM API here (e.g., GPT-4)
    // Build a system prompt that includes caseContext in a safe way.
    // For now we’ll just echo something simple.

    console.log("[claim-assistant] Incoming request", {
      messagesCount: messages.length,
      lastMessageRole: lastMessage?.role,
      lastMessagePreview: lastMessage?.content.slice(0, 120), // avoid logging full text
      caseContext: {
        benefitName: caseContext.benefitName,
        claimStage: caseContext.claimStage,
        stylePreference: caseContext.stylePreference,
        // omit very detailed fields if you want to be extra careful
      },
    });

    const reply =
      "This is a placeholder reply. I now know a bit about your situation and benefit. " +
      "When I am connected to an AI model, I will help you draft answers for your form based on what you’ve shared.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[claim-assistant] Error handling POST", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
