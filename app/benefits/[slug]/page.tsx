import Infobox from "@/app/components/Infobox";
import Section from "@/app/components/Section";
import PrintButton from "@/app/components/PrintButton";
import { getBenefitDataBySlug } from "@/app/lib/benefits";
import ReadAloud from "@/app/components/ReadAloud";

export default async function BenefitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const benefit = getBenefitDataBySlug(slug);
  const sections = benefit.article?.sections ?? [];

  return (
    <article className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8">
      <header className="pt-4 md:pt-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {benefit.title}
        </h1>
      </header>

      {/* Top utility bar */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-gray-200 py-2 text-sm print:hidden">
        <PrintButton />
      </div>

      {/* Grid: Main content + (sticky) infobox */}
      <div className="relative mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] print:block">
        {/* Main column */}
        <div className="min-w-0">
          <section className="prose prose-gray max-w-none leading-relaxed">
            <p className="text-lg text-gray-700">{benefit.info}</p>

            {/* Contents box (shows on md+) */}
            {sections.length > 0 ? (
              <div className="not-prose mt-6 hidden rounded-lg border border-gray-200 bg-white p-4 text-sm md:block">
                <div className="mb-2 font-semibold">Contents</div>
                <ol className="list-decimal space-y-1 pl-5">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="text-blue-700 underline-offset-2 hover:underline"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="mt-6 hidden text-sm text-gray-500 md:block">
                No contents available for this article.
              </div>
            )}
          </section>

          <div className="mb-3 flex justify-end">
            <ReadAloud targetId="article-content" defaultRate={1} />
          </div>

          {/* Unwinding sections */}
          <div id="article-content">
            {sections.map((s) => (
              <Section
                key={s.id}
                id={s.id}
                title={s.title}
                body={s.body ?? ""}
                figure={s.figure ?? ""}
                figureCaption={s.figureCaption ?? ""}
              />
            ))}
          </div>
        </div>

        <Infobox status={"Active"} published={"2026"} />
      </div>
    </article>
  );
}
