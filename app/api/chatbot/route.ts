import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages?: ChatMessage[];
      caseContext?: CaseContext;
    };

    const { messages = [], caseContext = {} } = body;

    // // 🔍 DEBUG: log full incoming payload
    // console.log(
    //   "[claim-assistant] User messages >>>",
    //   JSON.stringify(body, null, 2),
    //   "<<< END RAW REQUEST BODY",
    // );

    // ✅ Don’t accept system messages from the client (prevents prompt injection)
    const safeMessages = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    // Base style rule (default)
    let stylePreference =
      "Write at least 2–3 short paragraphs of draft text. Make it clear and easy to scan.";

    // ---- Final system prompt ----
    const system = `
You are Advokit’s claim assistant. Help the user (likely with aphasia) draft clear, honest answers for their benefit forms.

Rules:
- If the user says “More detail”, expand your previous answer.
- If the user says “Less detail”, shorten your previous answer.
- If the user says “Bad response / try again”, rewrite your previous answer using a different approach.

Context:
- benefitName: ${caseContext.benefitName ?? "unknown"}
- claimStage: ${caseContext.claimStage ?? "unknown"}
- conditions: ${caseContext.conditions ?? "unknown"}
- dailyImpact: ${caseContext.dailyImpact ?? "unknown"}
`.trim();

    // console.log(
    //   "[claim-assistant] SYSTEM PROMPT >>>\n" +
    //     system +
    //     "\n<<< END SYSTEM PROMPT",
    // );

    console.log(
      "[claim-assistant] OPENAI INPUT (FULL) >>>",
      JSON.stringify(
        [{ role: "system", content: system }, ...safeMessages],
        null,
        2,
      ),
      "<<< END OPENAI INPUT",
    );

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [{ role: "system", content: system }, ...safeMessages],
      max_output_tokens: 600,
    });

    console.log(
      "[claim-assistant] OPENAI OUTPUT TEXT >>>",
      response.output_text,
      "<<< END OPENAI OUTPUT TEXT",
    );

    return NextResponse.json({ reply: response.output_text });
  } catch (err) {
    console.error("[claim-assistant] Error handling POST", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
