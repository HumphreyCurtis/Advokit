import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import OpenAI from "openai";
import { Participant } from "../../types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Role = "user" | "assistant" | "system";

interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAtISO?: string;
}

interface CaseContext {
  benefitName?: string;
  claimStage?: string;
  conditions?: string;
  dailyImpact?: string;
}

interface InteractionEvent {
  id: string;
  type: string;
  createdAtISO: string;
  messageId?: string;
  value?: string;
  inputMode?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages?: ChatMessage[];
      interactions?: InteractionEvent[]; // ✅ add
      caseContext?: CaseContext;
      participant?: Participant;
      sessionId?: string;
    };

    const {
      messages = [],
      interactions = [],
      caseContext = {},
      participant,
      sessionId,
    } = body;

    // // 🔍 DEBUG: log full incoming payload
    // console.log(
    //   "[claim-assistant] User messages >>>",
    //   JSON.stringify(body, null, 2),
    //   "<<< END RAW REQUEST BODY",
    // );

    console.log("🔥 /api/chatbot POST hit");
    console.log(body);
    console.log(participant);

    // ✅ TEMP: MongoDB connectivity check
    // const mongoClient = await clientPromise;
    // await mongoClient
    //   .db(process.env.MONGODB_DB || "advokit")
    //   .collection("ping")
    //   .insertOne({
    //     ok: true,
    //     at: new Date(),
    //   });

    // ✅ Don’t accept system messages from the client (prevents prompt injection)
    const modelMessages = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const loggedMessages = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAtISO: m.createdAtISO ?? new Date().toISOString(),
      }));

    // Base style rule (default)
    // let stylePreference =
    //   "Write at least 2–3 short paragraphs of draft text. Make it clear and easy to scan.";

    // ---- Final system prompt ----
    // const system = `
    // You are Advokit’s claim assistant. Help the user (likely with aphasia) draft clear, honest answers for their benefit forms.

    // Rules:
    // - If the user says “More detail”, expand your previous answer.
    // - If the user says “Less detail”, shorten your previous answer.
    // - If the user says “Bad response / try again”, rewrite your previous answer using a different approach.

    // Guidance:
    // - Follow the principles used in Advokit’s benefit guidance (e.g., focusing on functional impact and real-life difficulties).
    // - When relevant, encourage users to describe their worst days rather than their best days, and to explain how their condition affects them over time and across situations.

    // Context:
    // - benefitName: ${caseContext.benefitName ?? "unknown"}
    // - claimStage: ${caseContext.claimStage ?? "unknown"}
    // - conditions: ${caseContext.conditions ?? "unknown"}
    // - dailyImpact: ${caseContext.dailyImpact ?? "unknown"}
    // `.trim();

    const system = `
You are Advokit’s claim assistant. Help the user (likely with aphasia) draft clear, honest, first-person answers for benefit forms in plain English.

CRITICAL OUTPUT FORMAT (always follow):
- Respond using EXACTLY these two sections, in this order:

COACHING:
<Optional. If present, include 0–2 short bullet points with suggestions or next steps, written for the user.
If COACHING is present, ALWAYS end with the phrase: “You could draft something like:”.>

ANSWER:
<The exact text the user should copy into the form>

Rules for ANSWER:
- ONLY include the drafted form text. No prefaces (e.g., “Here’s a suggestion”), no questions, no commentary.
- Use first person (“I…”), concrete day-to-day examples, and functional impact.
- Avoid medical jargon unless the user used it.
- Keep it readable: short sentences, one idea per sentence.

Interaction rules:
- If the user says “More detail”, expand your previous ANSWER with additional specific examples (still plain English).
- If the user says “Less detail”, shorten your previous ANSWER while keeping the key functional impacts.
- If the user says “Bad response / try again”, rewrite your previous ANSWER using a different structure or examples, without changing the facts.
- If the user asks a question instead of providing content, answer briefly in COACHING and provide a short suggested ANSWER if appropriate.

Guidance (Advokit principles):
- Focus on functional impact and real-life difficulties.
- When relevant, describe worst days as well as typical days, and how things vary over time and situations.
- Do not exaggerate. Do not invent details. If information is missing, make a reasonable neutral placeholder (e.g., “[add example here]”) rather than guessing.

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
        [{ role: "system", content: system }, ...modelMessages],
        null,
        2,
      ),
      "<<< END OPENAI INPUT",
    );

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [{ role: "system", content: system }, ...modelMessages],
      max_output_tokens: 600,
    });

    console.log(
      "[claim-assistant] OPENAI OUTPUT TEXT >>>",
      response.output_text,
      "<<< END OPENAI OUTPUT TEXT",
    );

    const assistantLogged = {
      id: `assistant-${Date.now()}`,
      role: "assistant" as const,
      content: response.output_text,
      createdAtISO: new Date().toISOString(), // ✅ single timestamp for GPT output
    };

    // Log to MongoDB
    const mongoClient = await clientPromise;
    const dbName = process.env.MONGODB_DB || "advokit";

    await mongoClient
      .db(dbName)
      .collection("chat_logs")
      .insertOne({
        createdAt: new Date(),
        participant,
        sessionId,
        caseContext,
        messages: [...loggedMessages, assistantLogged],
        interactions,
        model: "gpt-4o-mini",
      });

    return NextResponse.json({ reply: response.output_text });
  } catch (err) {
    console.error("[claim-assistant] Error handling POST", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
