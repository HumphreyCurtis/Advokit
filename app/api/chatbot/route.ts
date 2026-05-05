import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import OpenAI from "openai";
import { Participant, Role } from "../../types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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


    // ✅ TEMP: MongoDB connectivity check
    // const mongoClient = await clientPromise;
    // await mongoClient
    //   .db(process.env.MONGODB_DB || "advokit")
    //   .collection("ping")
    //   .insertOne({
    //     ok: true,
    //     at: new Date(),
    //   });

    
    // Filter and map messages for the model
    const modelMessages: OpenAI.Chat.ChatCompletionMessageParam[] = messages
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

  const system = `
    You are Benefit Buddy, a friendly claim assistant from the Advokit project. Help the user (likely with aphasia) draft clear, honest, first-person answers for benefit forms in plain English.

    ### CRITICAL OUTPUT FORMAT
    You must respond using this exact structure. Do not include any introductory chat (like "Sure, I can help") or closing remarks.

    COACHING:
    <0–2 short bullet points with suggestions or answers to questions. If this section is present, ALWAYS end it with the exact phrase: "You could draft something like:">

    ANSWER:
    <The exact text for the form. If the user asked a general question and no form draft is needed yet, provide a one-sentence summary here that they could use to explain their situation to others.>

    ### RULES FOR THE ANSWER SECTION:
    - Use first person ("I...").
    - Focus on functional impact: how the condition limits daily activities.
    - Use concrete, day-to-day examples (e.g., "I struggle to grip a standard kettle").
    - Describe "worst days" and variability over time.
    - Keep sentences short. One idea per sentence. Minimal jargon.
    - If specific information is missing, use a bracketed placeholder: "[add example here]". Do not invent facts.

    ### INTERACTION LOGIC:
    - **General Questions:** If the user asks "What is PIP?" or similar, explain it in COACHING. Use ANSWER to provide a simple "script" they can use to explain that benefit to a friend or official.
    - **More detail:** Expand the previous ANSWER with more specific functional examples.
    - **Less detail:** Shorten the previous ANSWER to only the most vital impacts.
    - **Bad response / try again:** Rewrite the previous ANSWER using different phrasing or a different functional focus.

    ### CONTEXT:
    - Benefit: ${caseContext.benefitName ?? "unknown"}
    - Stage: ${caseContext.claimStage ?? "unknown"}
    - Conditions: ${caseContext.conditions ?? "unknown"}
    - Daily Impact: ${caseContext.dailyImpact ?? "unknown"}
  `.trim();

    
    // console.log(
    //   "[claim-assistant] SYSTEM PROMPT >>>\n" +
    //     system +
    //     "\n<<< END SYSTEM PROMPT",
    // );

    // console.log(
    //   "[claim-assistant] OPENAI INPUT (FULL) >>>",
    //   JSON.stringify(
    //     [{ role: "system", content: system }, ...modelMessages],
    //     null,
    //     2,
    //   ),
    //   "<<< END OPENAI INPUT",
    // );

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: system }, ...modelMessages],
      max_tokens: 600,
    });

    // console.log(
    //   "[claim-assistant] OPENAI OUTPUT TEXT >>>",
    //   response.output_text,
    //   "<<< END OPENAI OUTPUT TEXT",
    // );

    const replyText = response.choices[0]?.message?.content || "";

    const assistantLogged = {
      id: `assistant-${Date.now()}`,
      role: "assistant" as const,
      content: replyText,
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
    
      return NextResponse.json({ reply: replyText });

  } catch (err) {
    console.error("[claim-assistant] Error handling POST", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
