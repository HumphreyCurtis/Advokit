import Section from "@/app/components/Section";
import { getBenefitDataBySlug } from "@/app/lib/benefits";
import Link from "next/link";

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
      <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-gray-200 py-2 text-sm">
        <Link
          href="#"
          className="underline underline-offset-2 hover:text-blue-700"
        >
          Talk
        </Link>
        <span aria-hidden>·</span>
        <Link
          href="#"
          className="underline underline-offset-2 hover:text-blue-700"
        >
          Print
        </Link>
      </div>

      {/* Grid: Main content + (sticky) infobox */}
      <div className="relative mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Main column */}
        <div className="min-w-0">
          <section className="prose prose-gray max-w-none leading-relaxed">
            <p className="text-lg text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              congue…
            </p>

            {/* Contents box (shows on md+) */}
            {sections.length > 0 ? (
              <div className="not-prose mt-6 hidden border border-gray-200 bg-white p-4 text-sm md:block">
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

          {/* Unwinding sections */}

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

        {/* Infobox column (sticky) */}
        <aside className="hidden lg:block lg:self-start">
          <div className="sticky top-16 rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-4">
              <h3 id="quick-facts" className="text-base font-semibold">
                Quick facts
              </h3>
            </div>
            <dl className="divide-y divide-gray-200 text-sm">
              <div className="grid grid-cols-3 gap-3 p-4">
                <dt className="col-span-1 text-gray-500">Category</dt>
                <dd className="col-span-2 font-medium">Lorem</dd>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4">
                <dt className="col-span-1 text-gray-500">Status</dt>
                <dd className="col-span-2 font-medium">Active</dd>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4">
                <dt className="col-span-1 text-gray-500">First published</dt>
                <dd className="col-span-2 font-medium">2021</dd>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4">
                <dt className="col-span-1 text-gray-500">License</dt>
                <dd className="col-span-2 font-medium">CC BY-SA</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </article>
  );
}
