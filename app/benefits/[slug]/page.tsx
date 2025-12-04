import Infobox from "@/app/components/Infobox";
import Section from "@/app/components/Section";
import PrintButton from "@/app/components/PrintButton";
import { getBenefitDataBySlug } from "@/app/lib/benefits";
import ReadAloud from "@/app/components/ReadAloud";
import KeyResources from "@/app/components/KeyResources";
import VideoPlayer from "@/app/components/VideoPlayer";
import ProgressiveTips from "@/app/components/ProgressiveTips";

export default async function BenefitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const benefit = getBenefitDataBySlug(slug);
  const sections = benefit.article?.sections ?? [];

  return (
    <article className="mx-auto w-full max-w-5xl px-1 md:px-6 lg:px-8">
      <header className="pt-4 md:pt-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {benefit.title}
        </h1>
      </header>
      <hr className="mt-2 border-y border-black-200" />

      {/* Grid: Main content + (sticky) infobox */}
      <div className="relative mt-1 grid grid-cols-1 gap-6 print:block">
        {/* Main column */}

        <div id="article-content" className="min-w-0">
          <details className="mt-4 rounded-xl border border-gray-200 bg-white/70 p-4">
            <summary className="text-xl mb-2 font-semibold">Learn more</summary>
            <div className="flex items-center mt-3">
              <ReadAloud targetId="benefit-info" defaultRate={1} />
            </div>
            <div id="benefit-info">
              <p
                id="benefit-info"
                className="text-lg text-gray-700"
                dangerouslySetInnerHTML={{ __html: benefit.info }}
              ></p>
            </div>
          </details>

          <div className="mt-4">
            <ProgressiveTips sections={sections} />
          </div>
          {/* Unwinding sections */}
          <details className="mt-4 rounded-xl border border-gray-200 bg-white/70 p-4">
            <summary className="cursor-pointer text-m font-medium">
              Show tips as a list
            </summary>
            <div id="tip-list">
              {sections.map((s) => (
                <Section
                  key={s.id}
                  id={s.id}
                  title={s.title}
                  body={s.body ?? ""}
                  figure={s.figure ?? ""}
                  figureCaption={s.figureCaption ?? ""}
                  audio={s.audio ?? ""}
                  audioCaption={s.audioCaption ?? ""}
                />
              ))}
            </div>
          </details>

          <KeyResources resources={benefit.resources ?? []} />
        </div>
      </div>
    </article>
  );
}

/* Top utility bar */
// <div className="mt-2 border-y border-black-200 py-2 print:hidden">
//   <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
//     <PrintButton />
//     <ReadAloud targetId="article-content" defaultRate={1} />
//   </div>
// </div>

/*
 */

// <div>
//   <VideoPlayer videos={benefit.videos ?? []} />
// </div>

// {/* Contents box (shows on md+) */}
// {sections.length > 0 ? (
//   <div className="not-prose mt-6 hidden rounded-lg border border-gray-200 bg-white p-4 text-sm md:block">
//     <div className="mb-2 font-semibold">
//       Our community top {benefit.title} tips
//     </div>
//     <ol>
//       {sections.map((section) => (
//         <li key={section.id}>
//           <a
//             href={`#${section.id}`}
//             className="text-blue-700 underline-offset-2 hover:underline"
//           >
//             {section.title}
//           </a>
//         </li>
//       ))}
//     </ol>
//   </div>
// ) : (
//   <div className="mt-6 hidden text-sm text-gray-500 md:block">
//     No contents available for this article.
//   </div>
// )}
