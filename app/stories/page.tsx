import type { Video } from "../types";
import YouTube from "../components/Youtube";
import { ReadAloud } from "../components/ReadAloud";

/* Stories page on Advokit website */
export default function Stories() {
  /* Hard coded video data as an array
   * Links to YouTube and transcripts of people's benefit stories to be included below
   */
  const videos: Video[] = [
    {
      title: "Three Strokes, Three PIP Attempts",
      url: "https://youtu.be/sHKnGP8aepM",
      info: "In this video, we speak with a woman living with severe aphasia after three strokes (2011, 2014, 2020). She explains what applying for Personal Independence Payment (PIP) was like after being refused, why she decided to try again, and what helped her keep going. We also discuss the role of partner support and community organisations in gathering evidence and coping with the stress of the process.",
      transcript:
        "/transcript/Advokit_ThreeStrokes_ThreePIPAttempts_transcript.pdf",
    },
    {
      title: "A Husband’s Guide to Blue Badge Applications & Appeals",
      url: "https://youtu.be/jIGUuHiU9xk",
      info: "In this video, a husband and carer shares how he supported his wife (who lives with aphasia) through the Blue Badge process. He talks through the application, what happened when they were rejected, and how they approached the appeal—including what evidence made the biggest difference. We also connect day-to-day impacts of aphasia (fatigue, anxiety in noisy places, confidence, communication barriers) to mobility, planning journeys, and accessing services fairly.",
      transcript:
        "/transcript/Advokit_AHusbandsGuideToBlueBadgeApplicationsAppeals_transcript.pdf",
    },
    {
      title: "3 PIP Rejections, Then Success — Why Appealing Matters",
      url: "https://youtu.be/yvJ6XPNVDSA",
      info: "In this video, a man shares his experience of applying for Personal Independence Payment (PIP) after a stroke that led to aphasia. He describes applying multiple times, being refused repeatedly, and eventually succeeding through the appeals process. We discuss what support helped (including Citizens Advice and an aphasia advocate), what he wishes he’d known earlier, and why it can be worth challenging decisions when you can.",
      transcript:
        "/transcript/Advokit_3PIPRejectionsThenSuccess_transcript.pdf",
    },
    {
      title:
        "An SLT’s Best Advice for Benefit Applicants (20+ Years Supporting Applications)",
      url: "https://youtu.be/CUzAT_R89sM",
      info: "In this video, Sally, a Speech & Language Therapist (SLT) with 20+ years’ experience supporting benefit applications, shares practical advice for navigating disability benefits—especially PIP—for people with aphasia and other hidden disabilities. We cover why applications can be so difficult (long forms, deadlines, collecting information), how communication needs are often underestimated, and what strong evidence can look like in practice. We also discuss ways to get support and reduce the burden on applicants and families.",
      transcript:
        "/transcript/Advokit_SLTsAdviceForBenefitApplicants_transcript.pdf",
    },
    {
      title: "A Young Man’s Story Living with Aphasia & Hidden Disability",
      url: "https://youtu.be/DcXJFVfYbCs",
      info: "In this video, a young man living with aphasia and epilepsy after a traumatic brain injury (TBI) shares his experience of navigating PIP. He describes learning what support existed, how difficult the process felt when doing it alone, and how getting help changed things. We also talk about reassessments and the stress of potentially losing support, plus practical tips (for example: answering from your “worst day” and bringing someone with you). He also mentions other support options such as the Hidden Disabilities Sunflower and a CEA Card for accessible venues.",
      transcript:
        "/transcript/Advokit_YoungMansStoryLivingWithAphasia_transcript.pdf",
    },
  ];
  return (
    <main className="bg-advokit-page text-black-900 min-h-screen">
      <div className="mx-auto max-w-5xl px-2 py-5 md:px-4 md:py-8">
        <section aria-label="Benefit Stories">
          <div className="mx-auto max-w-6xl">
            {/* Header and title */}
            <header className="mb-4 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                  Benefit Stories
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Watch short benefit stories from people living with aphasia in
                  London.
                </p>
              </div>

              <p className="shrink-0 text-sm text-gray-500">
                {videos.length} video{videos.length === 1 ? "" : "s"}
              </p>
            </header>

            {/* Maps through video array building one column grids
             * of title, url and transcript data
             */}
            <div className="space-y-6">
              {videos.map(({ title, url, info, transcript }, i) => (
                <article key={url ?? i} className="rounded-2xl bg-white">
                  <div className="p-5">
                    <details className="bg-white/70">
                      <summary className="cursor-pointer text-2xl font-semibold mb-2">
                        {title ?? "Untitled video"}
                      </summary>

                      <ReadAloud
                        text={info ?? "No informaton"}
                        defaultRate={1}
                        buttonLabel="Video synopsis"
                      />
                    </details>

                    {/* YouTube component */}
                    <YouTube
                      url={url}
                      title={title ?? `YouTube video ${i + 1}`}
                    />

                    {/* Transcript button */}
                    <a
                      href={transcript}
                      download
                      className="
            mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200
            bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm
            hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300
          "
                    >
                      <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-700">
                        [PDF]
                      </span>
                      Transcript
                      <span className="font-mono text-gray-500"></span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
