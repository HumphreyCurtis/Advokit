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

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages?: ChatMessage[];
      caseContext?: CaseContext;
      participant?: Participant;
      sessionId?: string;
    };

    const { messages = [], caseContext = {}, participant, sessionId } = body;

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
    const system = `
    You are Advokit’s claim assistant. Help the user (likely with aphasia) draft clear, honest answers for their benefit forms.

    Rules:
    - If the user says “More detail”, expand your previous answer.
    - If the user says “Less detail”, shorten your previous answer.
    - If the user says “Bad response / try again”, rewrite your previous answer using a different approach.

    Guidance:
    - Follow the principles used in Advokit’s benefit guidance (e.g., focusing on functional impact and real-life difficulties).
    - When relevant, encourage users to describe their worst days rather than their best days, and to explain how their condition affects them over time and across situations.

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

  await mongoClient.db(dbName).collection("chat_logs").insertOne({
    createdAt: new Date(),
    participant,
    sessionId,
    caseContext,
    messages: [...loggedMessages, assistantLogged],
    model: "gpt-4o-mini",
  });

    return NextResponse.json({ reply: response.output_text });
  } catch (err) {
    console.error("[claim-assistant] Error handling POST", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
