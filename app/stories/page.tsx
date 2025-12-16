import type { Video } from "../types";
import YouTube from "../components/Youtube";

/* Stories page on Advokit website */
export default function Stories() {
  /* Hard coded video data as an array
   * Links to YouTube and transcripts of people's benefit stories to be included below
   */
  const videos: Video[] = [
    {
      title: "Three Strokes, Three PIP Attempts",
      url: "https://youtu.be/sHKnGP8aepM",
      transcript: "none.pdf",
    },
    {
      title: "A Husband’s Guide to Blue Badge Applications & Appeals",
      url: "https://youtu.be/jIGUuHiU9xk",
      transcript: "none.pdf",
    },
    {
      title: "3 PIP Rejections, Then Success — Why Appealing Matters",
      url: "https://youtu.be/yvJ6XPNVDSA",
      transcript: "none.pdf",
    },
    {
      title:
        "An SLT’s Best Advice for Benefit Applicants (20+ Years Supporting Applications)",
      url: "https://youtu.be/CUzAT_R89sM",
      transcript: "none.pdf",
    },
    {
      title: "A Young Man’s Story Living with Aphasia & Hidden Disability",
      url: "https://youtu.be/DcXJFVfYbCs",
      transcript: "none.pdf",
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
              {videos.map(({ title, url, transcript }, i) => (
                <article
                  key={url ?? i}
                  className="rounded-2xl border border-gray-200 bg-white"
                >
                  <div className="p-5 sm:p-6">
                    <div className="mb-4 flex items-baseline justify-between gap-4">
                      <h2 className="min-w-0 text-2xl font-semibold text-gray-900">
                        {title ?? "Untitled video"}
                      </h2>
                    </div>

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
