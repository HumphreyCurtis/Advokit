import { getBenefitDataBySlug } from "@/app/lib/benefits";
import Link from "next/link";

export default async function BenefitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const benefit = getBenefitDataBySlug(slug);

  const sections = [
    { id: "stage-1", title: "Stage 1 — Foundations" },
    { id: "stage-2", title: "Stage 2 — Exploration" },
    { id: "stage-3", title: "Stage 3 — Integration" },
    { id: "stage-4", title: "Stage 4 — Evaluation" },
    { id: "stage-5", title: "Stage 5 — Outlook & Limitations" },
  ];
  return (
    <article className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8">
      <header className="pt-4 md:pt-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {benefit.title}
        </h1>
        <p className="mt-3 text-base text-gray-600">
          <span>Approx. 8 min read</span>
        </p>
      </header>

      {/* Top utility bar */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-gray-200 py-2 text-sm">
        <Link
          href="#"
          className="underline underline-offset-2 hover:text-blue-700"
        >
          View history
        </Link>
        <span aria-hidden>·</span>
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
          Print/export
        </Link>
      </div>

      {/* Grid: Infobox (sticky) + Content + TOC */}
      <div className="relative mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Main Column */}
        <div className="min-w-0">
          {/* Lead section */}
          <section className="prose prose-gray max-w-none leading-relaxed">
            <p className="text-lg text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              congue, nibh a aliquet vehicula, leo tellus facilisis sem, nec
              vulputate nunc mi id orci. Vestibulum posuere magna sed congue
              luctus. Integer faucibus ligula a tincidunt pulvinar. Sed
              facilisis sit amet justo id accumsan. Curabitur et sollicitudin
              nibh. Nunc malesuada, purus at dapibus ultrices, nisl risus
              dapibus eros, id convallis tortor nibh sed nunc. Nam in arcu vitae
              nisl pretium iaculis. Suspendisse magna tortor, feugiat in
              faucibus id, accumsan at sapien.
            </p>

            {/* Contents box (shows on md+) */}
            <div className="not-prose mt-6 hidden border border-gray-200 bg-white p-4 text-sm md:block">
              <div className="mb-2 font-semibold">Contents</div>
              <ol className="list-decimal space-y-1 pl-5">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-blue-700 underline-offset-2 hover:underline"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Image / Figure */}
          <figure className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img
              src="https://picsum.photos/1200/600"
              alt="Illustrative placeholder"
              className="h-auto w-full"
            />
            <figcaption className="px-4 py-3 text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Caption
              text can include a brief description and source.
            </figcaption>
          </figure>

          {/* Stage Sections */}
          <section
            id="stage-1"
            className="prose prose-gray max-w-none scroll-mt-16"
          >
            <h2>Stage 1 — Foundations</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              interdum, urna id volutpat molestie, arcu odio ultrices lacus, ut
              varius lectus ligula nec lectus. Maecenas egestas mi bibendum
              bibendum tempus. Integer efficitur, dui id viverra efficitur,
              magna mi pharetra velit, et aliquet lorem magna eget risus.
            </p>
            <ul>
              <li>
                Phasellus vehicula sapien a neque interdum, at feugiat ligula
                viverra.
              </li>
              <li>Donec quis turpis id nibh suscipit eleifend.</li>
              <li>Morbi nec leo ut dui posuere tincidunt.</li>
            </ul>
            <blockquote>
              “Duis vel velit sit amet lectus facilisis pulvinar.”
            </blockquote>
          </section>

          <section
            id="stage-2"
            className="prose prose-gray mt-10 max-w-none scroll-mt-16"
          >
            <h2>Stage 2 — Exploration</h2>
            <p>
              Sed cursus, justo eget blandit luctus, mi dui dictum nibh, ut
              mattis ex arcu id nunc. Pellentesque in sem euismod, ultrices
              justo at, scelerisque nisl. Sed id lectus volutpat, fermentum
              tortor non, aliquet nunc.
            </p>
            <div className="not-prose my-4 overflow-hidden rounded-md border border-gray-200">
              <div className="grid grid-cols-2 divide-x divide-gray-200 text-sm sm:grid-cols-4">
                <div className="p-3">
                  <div className="text-gray-500">Metric A</div>
                  <div className="font-semibold">72%</div>
                </div>
                <div className="p-3">
                  <div className="text-gray-500">Metric B</div>
                  <div className="font-semibold">118</div>
                </div>
                <div className="p-3">
                  <div className="text-gray-500">Metric C</div>
                  <div className="font-semibold">4.2</div>
                </div>
                <div className="p-3">
                  <div className="text-gray-500">Metric D</div>
                  <div className="font-semibold">Low</div>
                </div>
              </div>
            </div>
            <p>
              Vivamus scelerisque velit quis urna bibendum, sed posuere leo
              varius. Nullam ac dolor est. Integer mattis erat vitae erat
              feugiat, a fermentum urna dictum.
            </p>
          </section>

          <section
            id="stage-3"
            className="prose prose-gray mt-10 max-w-none scroll-mt-16"
          >
            <h2>Stage 3 — Integration</h2>
            <p>
              Proin sit amet rhoncus lacus. Suspendisse vestibulum arcu in neque
              congue, eu congue nulla aliquet. Integer feugiat congue velit, a
              volutpat ligula maximus in. Aliquam sed nunc et eros vestibulum
              gravida sit amet id ipsum.
            </p>
            <h3>Subprocess</h3>
            <ol>
              <li>Collate inputs and normalize formats.</li>
              <li>Apply review checkpoints and approvals.</li>
              <li>Publish interim outputs and collect feedback.</li>
            </ol>
            <p>
              Maecenas vitae arcu a lorem bibendum congue. Donec et justo
              finibus, rutrum neque sit amet, cursus mi.
            </p>
          </section>

          <section
            id="stage-4"
            className="prose prose-gray mt-10 max-w-none scroll-mt-16"
          >
            <h2>Stage 4 — Evaluation</h2>
            <p>
              Cras finibus sem a fringilla cursus. Sed vulputate mi nec
              malesuada venenatis. Curabitur interdum, ligula non tincidunt
              egestas, massa augue congue ante, ut pretium risus libero id urna.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Criterion</th>
                  <th>Method</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Reliability</td>
                  <td>Replicated trials</td>
                  <td>High</td>
                </tr>
                <tr>
                  <td>Usability</td>
                  <td>Task-based testing</td>
                  <td>Moderate</td>
                </tr>
                <tr>
                  <td>Adoption</td>
                  <td>Survey</td>
                  <td>Growing</td>
                </tr>
              </tbody>
            </table>
            <p>
              Etiam fermentum mauris in velit rhoncus, non finibus lorem
              bibendum. Quisque id metus quis neque gravida volutpat.
            </p>
          </section>

          <section
            id="stage-5"
            className="prose prose-gray mt-10 max-w-none scroll-mt-16"
          >
            <h2>Stage 5 — Outlook & Limitations</h2>
            <p>
              Integer efficitur, augue nec convallis condimentum, metus massa
              tincidunt lectus, sed rhoncus ante diam ut magna. Suspendisse
              tincidunt, metus ut pulvinar lacinia, orci lacus interdum erat, ac
              facilisis urna turpis nec augue.
            </p>
            <p>
              Limitations include sample constraints, ecological validity, and
              potential confounds. Future work may consider longitudinal
              deployments, broader demographic coverage, and comparative
              baselines.
            </p>
          </section>

          {/* References / See also */}
          <section
            id="references"
            className="prose prose-gray mt-12 max-w-none scroll-mt-16"
          >
            <h2>References</h2>
            <ul>
              <li>
                Lorem ipsum dolor sit amet. <em>Journal of Placeholder</em>,
                2023.
              </li>
              <li>
                Consectetur adipiscing elit. <em>Proceedings of Ipsum</em>,
                2024.
              </li>
            </ul>
          </section>
        </div>

        {/* Infobox (sticky on large screens) */}
        <aside className="hidden lg:block">
          <div className="sticky top-16 rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-4">
              <h3 className="text-base font-semibold">Quick facts</h3>
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
            <div className="border-t border-gray-200 p-4">
              <Link
                href="#"
                className="text-sm text-blue-700 underline underline-offset-2 hover:text-blue-800"
              >
                Related article
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
