import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const system = `You are Advokit’s claim assistant. Help the user (likely with aphasia) draft clear, honest answers for their benefit forms. Do not invent facts. If something is missing, ask 1–3 short follow-up questions. Context:
- benefitName: ${caseContext.benefitName ?? "unknown"}
- claimStage: ${caseContext.claimStage ?? "unknown"}
- stylePreference: ${caseContext.stylePreference ?? "simple"}
`;

    console.log(system);

    // Comment back!!!
    // const response = await client.responses.create({
    //   model: "gpt-4o-mini",
    //   input: [
    //     { role: "system", content: system },
    //     ...messages.map((m) => ({ role: m.role, content: m.content })),
    //   ],
    //   max_output_tokens: 600,
    // });
    // return NextResponse.json({ reply: response.output_text });
    return NextResponse.json({ reply: system });
  } catch (err) {
    console.error("[claim-assistant] Error handling POST", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
